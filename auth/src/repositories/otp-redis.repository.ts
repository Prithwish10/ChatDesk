import { Service } from 'typedi';
import { redisWrapper } from '../loaders/RedisWrapper';
import { OTPRecord } from '../interfaces/IOTPRecord';
import { logger } from '../loaders/logger';
import config from '../config/config.global';
const OTP_KEY = (recipientId: string) => `otp:${recipientId}`;
const RATE_LIMIT_KEY = (recipientId: string) => `otp:rl:${recipientId}`;

// Atomic Lua script: INCR the counter and set expiry only on the first increment.
// Returns the current count. Safe under concurrent access.
const RATE_LIMIT_SCRIPT = `
  local count = redis.call('INCR', KEYS[1])
  if count == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[1])
  end
  return count
`;

@Service()
export class OTPRedisRepository {
  private get redis() {
    return redisWrapper.client;
  }
  /**
   * Persists the hashed OTP for a recipient with a fixed TTL.
   * Replaces any previously stored OTP (idempotent overwrite).
   */
  async saveOtp(recipientId: string, hashedOtp: string): Promise<void> {
    try {
      const key = OTP_KEY(recipientId);
      const pipeline = this.redis.pipeline();
      pipeline.hset(key, 'hash', hashedOtp, 'attempts', '0');
      pipeline.expire(key, config.otp.ttlSeconds);
      await pipeline.exec();
    } catch (error) {
      logger.error(`Redis error while saving OTP for ${recipientId}: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves the stored OTP record for a recipient.
   * Returns null if the key has expired or does not exist.
   */
  async getOtp(recipientId: string): Promise<OTPRecord | null> {
    try {
      const data = await this.redis.hgetall(OTP_KEY(recipientId));
      if (!data || !data.hash) return null;
      return {
        hash: data.hash,
        attempts: parseInt(data.attempts ?? '0', 10),
      };
    } catch (error) {
      logger.error(`Redis error while fetching OTP for ${recipientId}: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes the OTP record after a successful verification to prevent replay attacks.
   */
  async deleteOtp(recipientId: string): Promise<void> {
    try {
      await this.redis.del(OTP_KEY(recipientId));
    } catch (error) {
      logger.error(`Redis error while deleting OTP for ${recipientId}: ${error}`);
      throw error;
    }
  }

  /**
   * Atomically increments the failed attempt counter on the OTP record.
   * Returns the new attempt count, or 0 if the OTP key no longer exists (already expired).
   */
  async incrementAttempts(recipientId: string): Promise<number> {
    try {
      const count = await this.redis.hincrby(OTP_KEY(recipientId), 'attempts', 1);
      return count;
    } catch (error) {
      logger.error(`Redis error while incrementing OTP attempts for ${recipientId}: ${error}`);
      throw error;
    }
  }

  /**
   * Checks whether a recipient has exceeded the OTP request rate limit.
   * Uses an atomic Lua script to guarantee correctness under high concurrency.
   *
   * @returns true  — request should be rejected (rate limited)
   * @returns false — request is within the allowed window
   */
  async isRateLimited(recipientId: string): Promise<boolean> {
    try {
      const key = RATE_LIMIT_KEY(recipientId);
      const count = (await this.redis.eval(
        RATE_LIMIT_SCRIPT,
        1,
        key,
        String(config.otp.rateLimitWindowSeconds),
      )) as number;
      return count > config.otp.maxOtpRequestsPerWindow;
    } catch (error) {
      logger.error(`Redis error while checking rate limit for ${recipientId}: ${error}`);
      throw error;
    }
  }
}
