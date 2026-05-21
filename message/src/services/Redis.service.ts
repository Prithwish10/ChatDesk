import { Service } from 'typedi';
import config from '../config/config.global';
import { RedisClient } from './RedisClient.service';
import { IMessageAttrs } from '../interfaces/IMessage';

@Service()
export class RedisService {
  private redis = RedisClient.getInstance();
  private LOCK_EXPIRY = 5000; // 5 seconds

  /**
   * Stores a message in Redis, using Sorted Set (ZSET) for ordered retrieval.
   */
  async storeMessage(message: IMessageAttrs): Promise<void> {
    const conversationId = message.conversationId.toString();
    const redisKey = `conv:${conversationId}:messages`;
    await this.redis.zadd(redisKey, message.messageId, JSON.stringify(message));

    // Mark conversation as active (for getActiveConversations)
    await this.redis.sadd('active_conversations', conversationId);
  }

  /**
   * Fetch a batch of messages for a conversation in correct order.
   * Uses cursor-based pagination (messageId as cursor).
   */
  async fetchMessagesByConversationId(
    conversationId: string,
    cursor: string | null,
    limit: number,
  ): Promise<IMessageAttrs[]> {
    const redisKey = `conv:${conversationId}:messages`;
    const minScore = cursor ? cursor : '-inf'; // Start from cursor if provided
    const messages = await this.redis.zrangebyscore(redisKey, minScore, '+inf', 'LIMIT', 0, limit);

    return messages.map((msg) => JSON.parse(msg));
  }

  /**
   * Removes messages that have been persisted in MongoDB.
   */
  async removeMessages(conversationId: string, maxMessageId: string): Promise<void> {
    const redisKey = `conv:${conversationId}:messages`;
    await this.redis.zremrangebyscore(redisKey, '-inf', maxMessageId);

    // If no messages left, remove conversation from active list
    const remaining = await this.queueSize(conversationId);
    if (remaining === 0) {
      await this.redis.srem('active_conversations', conversationId);
    }
  }

  /**
   * Get total messages count for a conversation.
   */
  async queueSize(conversationId: string): Promise<number> {
    const redisKey = `conv:${conversationId}:messages`;
    return await this.redis.zcount(redisKey, '-inf', '+inf');
  }

  /**
   * Fetch all active conversations that have pending messages.
   */
  async getActiveConversations(): Promise<string[]> {
    return await this.redis.smembers('active_conversations');
  }

  /**
   * Acquire a distributed lock for a conversation to ensure only one node processes it.
   */
  async acquireLock(lockKey: string, expiry: number = this.LOCK_EXPIRY): Promise<boolean> {
    const result = await this.redis.set(lockKey, 'locked', 'PX', expiry, 'NX');
    return result === 'OK'; // Returns true if lock acquired
  }

  /**
   * Release the distributed lock.
   */
  async releaseLock(lockKey: string): Promise<void> {
    await this.redis.del(lockKey);
  }
}
