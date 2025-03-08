import { Service } from 'typedi';
import { ChainableCommander } from 'ioredis';
import { RedisClient } from './RedisClient.service';
import { RedisKeyUtil } from '../utils/Redis.util';

@Service()
export class RedisService {
  private redis = RedisClient.getInstance();
  private LOCK_EXPIRY = 5000; // 5 seconds

  /**
   * Stores a message in Redis, using Sorted Set (ZSET) for ordered retrieval.
   * Stores the message id, conversation id, last message, and last message timestamp.
   * Also marks the conversation as active by adding it to the SET 'active_conversations'.
   *
   * @param {any} message The message document to store.
   * @return {Promise<void>} A promise that resolves when the message has been stored.
   */
  async storeMessage(message: any): Promise<void> {
    const conversationId = message.conversationId.toString();
    const redisKey = RedisKeyUtil.lastMessageUpdate(conversationId);
    await this.redis.zadd(
      redisKey,
      message.messageId,
      JSON.stringify({
        conversationId,
        lastMessage: message.content,
        lastMessageAt: message.createdAt,
      }),
    );

    // Mark conversation as active
    await this.redis.sadd('active_conversations', conversationId);
  }

  /**
   * Fetches the latest message from Redis for a given conversation.
   * Uses ZREVRANGEBYSCORE to get the latest message, and LIMIT to get only 1 message.
   * Returns null if there are no messages in the conversation.
   *
   * @param {string} conversationId The id of the conversation.
   *
   * @return {Promise<any>} The latest message, or null if there are no messages.
   */
  async fetchLatestMessage(conversationId: string): Promise<any> {
    const redisKey = `conv:${conversationId}:messages`;
    const latestMessage = await this.redis.zrevrangebyscore(
      redisKey,
      '+inf',
      '-inf',
      'LIMIT',
      0,
      1,
    );

    return latestMessage?.length === 0 ? null : JSON.parse(latestMessage[0]);
  }

  /**
   * Fetches a batch of active conversations from Redis.
   * Uses SCAN with COUNT to fetch a limited number of conversations.
   * Marks the fetched conversations as 'processing' to prevent other
   * instances from processing them.
   *
   * @param {number} batchSize The number of conversations to fetch.
   *
   * @return {Promise<string[]>} A promise that resolves with an array of
   * conversation ids, or an empty array if there are no active conversations.
   */
  async getActiveConversationsBatch(batchSize: number): Promise<string[]> {
    const cursor = '0';
    const [nextCursor, conversations] = await this.redis.sscan(
      'active_conversations',
      cursor,
      'COUNT',
      batchSize,
    );
    if (conversations.length === 0) return [];
    await this.redis.sadd('processing_conversations', ...conversations);
    return conversations;
  }

  /**
   * Marks a conversation as processed, removing it from the
   * 'active_conversations' and 'processing_conversations' sets.
   *
   * @param {string} conversationId The ID of the conversation to mark as processed.
   *
   * @return {Promise<void>} A promise that resolves when the conversation has been marked as processed.
   */
  async markConversationProcessed(conversationId: string): Promise<void> {
    const pipeline = this.redis.pipeline();
    pipeline.srem('processing_conversations', conversationId);
    pipeline.srem('active_conversations', conversationId);
    await pipeline.exec();
  }

  /**
   * Removes messages that have been persisted in MongoDB.
   *
   * @param {string} conversationId The id of the conversation to remove messages from.
   * @param {string} maxMessageId The id of the latest message to remove.
   * @return {Promise<void>} A promise that resolves when the messages have been removed.
   */
  async removeMessages(conversationId: string, maxMessageId: string): Promise<void> {
    const redisKey = RedisKeyUtil.lastMessageUpdate(conversationId);
    await this.redis.zremrangebyscore(redisKey, '-inf', maxMessageId);

    // If no messages left, remove conversation from active list
    const remaining = await this.queueSize(conversationId);
    if (remaining === 0) {
      await this.redis.srem('active_conversations', conversationId);
    }
  }

  /**
   * Returns a Redis pipeline object that can be used to execute multiple Redis
   * commands atomically. This can be more efficient than executing multiple
   * commands separately, as it reduces the number of network round-trips.
   *
   * @return {ChainableCommander} A Redis pipeline object.
   */
  pipeline(): ChainableCommander {
    return this.redis.pipeline();
  }

  /**
   * Get total messages count for a conversation.
   */
  async queueSize(conversationId: string): Promise<number> {
    const redisKey = RedisKeyUtil.lastMessageUpdate(conversationId);
    return await this.redis.zcount(redisKey, '-inf', '+inf');
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
