import Redis from "ioredis";
import { Service } from "typedi";
import { RedisClient } from "./RedisClient.service";
import { logger } from "../loaders/logger";

@Service()
export class RedisService {
  private pubClient: Redis;
  private subClient: Redis;
  private redisClient: Redis = RedisClient.getInstance();

  constructor() {
    this.pubClient = this.redisClient.duplicate();
    this.subClient = this.redisClient.duplicate();
  }

  async publish(channel: string, message: any) {
    await this.pubClient.publish(channel, JSON.stringify(message));
  }

  subscribe(channel: string, handler: (message: any) => void) {
    this.subClient.subscribe(channel, (err, count) => {
      if (err) logger.error(`Failed to subscribe: ${err.message}`);
      else logger.info(`Subscribed to ${channel} (${count} channels)`);
    });

    this.subClient.on("message", (subscribedChannel, message) => {
      if (subscribedChannel === channel) {
        handler(JSON.parse(message));
      }
    });
  }
}
