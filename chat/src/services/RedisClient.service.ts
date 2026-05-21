import Redis from 'ioredis';
import config from '../config/config.global';
import { logger } from '../loaders/logger';

export class RedisClient {
  private static instance: Redis;

  private constructor() {}

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.connections.redisOptions);

      RedisClient.instance.on('connect', () => {
        logger.info('✅ Redis connected successfully!');
      });

      RedisClient.instance.on('error', (err) => {
        logger.error(`❌ Redis connection error: ${err}`);
      });

      RedisClient.instance.on('reconnecting', () => {
        logger.info('⏳ Redis client is re-connecting...!');
      });
    }
    return RedisClient.instance;
  }
}
