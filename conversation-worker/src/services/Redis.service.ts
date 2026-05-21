import { Service } from 'typedi';
import { Redis } from 'ioredis';
import { RedisConsumerGroup, RedisStream } from '@pdchat/common';
import { RedisClient } from './RedisClient.service';
import config from '../config/config.global';
import { logger } from '../loaders/logger';

@Service()
export class RedisService {
  private client: Redis;
  private stream: string;
  private consumerGroup: string;
  private consumerName: string;

  constructor(stream: RedisStream, consumerGroup: RedisConsumerGroup) {
    this.client = RedisClient.getInstance();

    this.stream = stream;
    this.consumerGroup = consumerGroup;
    this.consumerName = config.redisConsumerName;

    this.initConsumerGroup(stream, consumerGroup);
  }

  /**
   * Initializes a Redis consumer group for the specified stream.
   *
   * If the consumer group already exists, it will catch the 'BUSYGROUP' error
   * and ignore it. Otherwise, it logs any other errors encountered during
   * the creation of the consumer group.
   *
   * @param {RedisStream} stream The Redis Stream to create the consumer group for.
   * @param {RedisConsumerGroup} consumerGroup The name of the consumer group to create.
   *
   * @returns {Promise<void>} A promise that resolves when the consumer group
   * is successfully initialized or already exists.
   */
  private async initConsumerGroup(
    stream: RedisStream,
    consumerGroup: RedisConsumerGroup,
  ): Promise<void> {
    try {
      await this.client.xgroup('CREATE', stream, consumerGroup, '0', 'MKSTREAM');
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        logger.error(`❌ Error creating consumer group: ${error}`);
      }
    }
  }

  /**
   * Fetches messages from Redis for the specified consumer group.
   *
   * The number of messages to fetch can be specified as an optional argument.
   * If not provided, it defaults to 100. The function will block for at most
   * 2000 milliseconds if no messages are available.
   *
   * @param {RedisConsumerGroup} consumerGroup The name of the consumer group to fetch messages for.
   * @param {number} [count=100] The number of messages to fetch.
   *
   * @returns {Promise<any[]>} A promise that resolves with an array of messages
   * or an empty array if there are no messages available.
   */
  async fetchMessages(consumerGroup: RedisConsumerGroup, count: number = 100): Promise<any[]> {
    try {
      const response = await this.client.xreadgroup(
        'GROUP',
        consumerGroup,
        this.consumerName,
        'COUNT',
        count,
        'BLOCK',
        2000,
        'STREAMS',
        this.stream,
        '>',
      );

      logger.info(`✅ Fetched conversations from Redis stream (${this.stream}): ${response}`);
      if (!response) return [];

      const conversations: { id: string; data: Record<string, string> }[] = [];

      for (const [streamName, entries] of response as [string, [string, string[]][]][]) {
        for (const [id, fields] of entries) {
          const data: Record<string, string> = {};

          for (let i = 0; i < fields.length; i += 2) {
            if (fields[i + 1] !== undefined) {
              data[fields[i]] = fields[i + 1];
            }
          }

          conversations.push({ id, data });
        }
      }

      return conversations;
    } catch(error) {
        logger.error(`❌ Error fetching messages from Redis stream (${this.stream}): ${error}`);
        return [];
    }
  }

  /**
   * Acknowledges the messages with the given IDs in the specified stream.
   *
   * This method will only send an acknowledgement to Redis if the messageIds
   * array is not empty. If it is empty, the method will be a no-op.
   *
   * @param {string[]} messageIds The IDs of the messages to acknowledge.
   *
   * @returns {Promise<void>} A promise that resolves when the messages have been acknowledged.
   */
  async acknowledgeMessages(messageIds: string[]): Promise<void> {
    if (messageIds.length > 0) {
      await this.client.xack(this.stream, this.consumerGroup, ...messageIds);
    }
  }
}
