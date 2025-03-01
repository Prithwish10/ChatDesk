import config from '../config/config.global';
import Redis from 'ioredis';

export class RedisClient {
  private static instance: Redis;

  private constructor() {}

  static getInstance(): Redis {
    if (!RedisClient.instance) {
      RedisClient.instance = new Redis(config.connections.redisOptions);
    }
    return RedisClient.instance;
  }
}
