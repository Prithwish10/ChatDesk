import 'reflect-metadata';
import Container from 'typedi';
import { RedisConsumerGroup, RedisStream } from '@pdchat/common';
import DatabaseManager from './loaders/DatabaseManager';
import { logger } from './loaders/logger';
import { RedisService } from './services/Redis.service';
import { CreateBatchProcessor } from './services/CreateBatchProcessor';
import { ConversationRepository } from './repositories/Conversation.repository';

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _dbConnection: DatabaseManager;

  constructor(dbConnection: any) {
    this._dbConnection = dbConnection;
  }

  public async up(): Promise<void> {
    try {
      await this._dbConnection.connect();
      this.bindServices();
      this.bindPOSIXSignals();
    } catch (error: any) {
      logger.error(error);
      throw new Error(error);
    }
  }

  public async shutdown(): Promise<void> {
    try {
      const promise = [];
      if (this._dbConnection) {
        promise.push(this._dbConnection.disconnect());
        logger.info('⛔ Database connection closed. ⛔');
      }

      await Promise.all(promise);
      logger.info('⛔ Shutdown process completed. ⛔');
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown process: ${error}`);
      process.exit(1);
    }
  }

  private bindServices() {
    const redisService = new RedisService(
      RedisStream.createConversation,
      RedisConsumerGroup.conversationCreateGroup,
    );
    const conversationRepo = Container.get(ConversationRepository);
    const cronJobService = new CreateBatchProcessor(redisService, conversationRepo);
    cronJobService.startCronJob();
  }

  /**
   * Binds POSIX signals (SIGINT and SIGTERM) to trigger the graceful shutdown process.
   * When either SIGINT or SIGTERM is received, the `shutdown` method is called.
   */
  private bindPOSIXSignals() {
    process.on('SIGINT', async () => this.shutdown());
    process.on('SIGTERM', async () => this.shutdown());
  }
}

export default Server;
