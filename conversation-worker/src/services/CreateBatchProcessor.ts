import cron from 'node-cron';
import { Service } from 'typedi';
import { RedisConsumerGroup } from '@pdchat/common';
import config from '../config/config.global';
import { RedisService } from './Redis.service';
import { ConversationRepository } from '../repositories/Conversation.repository';
import { logger } from '../loaders/logger';

@Service()
export class CreateBatchProcessor {
  private batchSize = Number(config.batchSize) || 1000;

  constructor(
    private _redisService: RedisService,
    private _conversationRepository: ConversationRepository,
  ) {}


  /**
   * Fetches messages from Redis for the 'conversationCreate' group.
   * For each message, it creates a new Conversation document in MongoDB.
   * After successful insert, it acknowledges the messages to Redis.
   * If there are no messages to process, it logs a message and exits.
   *
   * @returns A promise that resolves when the batch processing is complete.
   * @throws Throws an error if there was a problem fetching or processing the messages.
   */
  public async processCreateConversationBatch(): Promise<void> {
    try {
        const messages = await this._redisService.fetchMessages(
          RedisConsumerGroup.conversationCreateGroup,
          this.batchSize,
        );

        if (messages.length === 0) {
          console.log('🟢 No new messages to process.');
          return;
        }

        const conversations = messages.map((msg) => ({
          participants: msg.data.participants,
          isGroup: msg.data.isGroup,
          groupName: msg.data.groupName || '',
          groupPhoto: msg.data.groupPhoto || '',
          createdBy: msg.data.createdBy
        }));

        await this._conversationRepository.bulkInsert(conversations);
        await this._redisService.acknowledgeMessages(messages.map((m) => m.id));
    } catch(error) {
      logger.error(`❌ Batch Processor Error: ${error}`);
      throw error;
    }
  }

  /**
   * Starts the cron job for batch processing.
   */
  public startCronJob(): void {
    const interval = config.cronSchedule || '*/1 * * * * *';

    cron.schedule(interval, async () => {
      await this.processCreateConversationBatch();
    });

    logger.info(`🟢 Batch Processor Cron job scheduled: ${interval}`);
  }
}
