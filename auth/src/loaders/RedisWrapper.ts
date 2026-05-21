import Redis from 'ioredis';
import { logger } from './logger';
import { Api500Error } from '@pdchat/common';
class RedisWrapper {
  private _client?: Redis;
  get client(): Redis {
    if (!this._client) {
      throw new Api500Error('Cannot access Redis client before connecting');
    }
    return this._client;
  }
  connect(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._client = new Redis(url, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times: number) => {
          if (times > 10) {
            logger.error('Redis: max retries exceeded, giving up');
            return null;
          }
          return Math.min(times * 150, 3000);
        },
        lazyConnect: true,
      });
      this._client.once('connect', () => {
        logger.info(`
      ################################################
      🛡️  Connected to Redis 🛡️
      ################################################
    `);
        resolve();
      });
      this._client.once('error', (err: Error) => {
        logger.error(`Redis connection error: ${err}`);
        reject(err);
      });
      this._client.connect().catch(reject);
    });
  }
  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.quit();
      logger.info('Redis client disconnected');
    }
  }
}
export const redisWrapper = new RedisWrapper();
