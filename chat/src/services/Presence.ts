import Redis, { RedisOptions } from "ioredis";
import { logger } from "../loaders/logger";
import { Api500Error } from "@pdchat/common";
import configGlobal from "../config/config.global";

export class Presence {
  private static instance: Presence;
  private _redisClient: Redis;

  private constructor(redisOptions: RedisOptions) {
    this._redisClient = new Redis(redisOptions);

    this._redisClient.on("error", (error) => {
      logger.error(`Error while connecting to redis: ${error}`);
    });

    this._redisClient.on("ready", () => {
      logger.info("🛡️  Redis client connection is ready! 🛡️");
    });

    this._redisClient.on("reconnecting", () => {
      logger.info("Redis client is re-connecting...!");
    });

    this._redisClient.on("end", () => {
      logger.info("Redis client connection ended!");
    });
  }

  public static getInstance(redisOptions: RedisOptions): Presence {
    if (!Presence.instance) {
      Presence.instance = new Presence(redisOptions);
    }
    return Presence.instance;
  }

  public getClient(): Redis {
    if (this._redisClient) {
      return this._redisClient;
    }
    throw new Api500Error(
      "Trying to access Redis client even before initialization"
    );
  }

  public async upsert(
    userId: string,
    socketConnectionId: string
  ): Promise<void> {
    try {
      await this._redisClient.hset(
        "presence",
        userId,
        JSON.stringify({
          socketConnectionId,
          when: Date.now(),
        })
      );
    } catch (error) {
      logger.error(
        `Error occured while upserting userId:${userId} & socketConnecionId: ${socketConnectionId} in cache`
      );
      throw error;
    }
  }

  public async remove(userId: string): Promise<void> {
    try {
      await this._redisClient.hdel("presence", userId);
    } catch (error) {
      logger.error(`Error occured while removing the userId: ${userId}`);
      throw error;
    }
  }

  public async getByUserId(userId: string): Promise<string | null> {
    try {
      const userDetails = await this._redisClient.hget("presence", userId);
      return userDetails;
    } catch (error) {
      logger.error(
        `Error occured while fetching user details by userId: ${userId}`
      );
      throw error;
    }
  }

  public async getList(): Promise<any[]> {
    try {
      const active = [];
      const dead = [];
      const now = Date.now();

      const presence = await this._redisClient.hgetall("presence");

      for (const connection in presence) {
        const details = JSON.parse(presence[connection]);
        details.connection = connection;

        if (now - details.when > configGlobal.socketOptions.pingTimeout) {
          dead.push(details);
        } else {
          active.push(details);
        }
      }

      if (dead.length) {
        this.clean(dead);
      }

      return active;
    } catch (error) {
      logger.error("Error occured while fetching list from the cache");
      throw error;
    }
  }

  public async clean(toDelete: any[]): Promise<void> {
    try {
      for (const presence of toDelete) {
        this.remove(presence.connection);
      }
    } catch (error) {
      logger.error(
        "Error occured while cleaning up the cache for the inactive users"
      );
      throw error;
    }
  }

  public async quit() {
    try {
      await this._redisClient.quit();
      logger.info(`
        ################################################
        🛡️  Redis client connection closed!! 🛡️
        ################################################
      `);
    } catch (error) {
      throw error;
    }
  }
}

export default Presence;
