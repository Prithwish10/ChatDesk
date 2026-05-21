import cron from 'node-cron';
import config from '../config/config.global';
import { RedisService } from './Redis.service';
import { MessageRepository } from '../repositories/Message.repository';
import { logger } from '../loaders/logger';
import { Inject, Service } from 'typedi';

@Service()
export class BatchProcessor {
  private isProcessing = false; // Prevent overlapping executions

  constructor(
    @Inject(() => RedisService) private _redisService: RedisService,
    @Inject(() => MessageRepository) private _messageRepository: MessageRepository,
  ) {
    this.startCronJob();
  }

  /**
   * Fetches messages per conversation and inserts them into MongoDB in batches.
   */
  private async processBatch(): Promise<void> {
    if (this.isProcessing) return; // Prevent parallel runs

    this.isProcessing = true;
    logger.info('⏳ Starting batch processing...');

    try {
      // Fetch conversation IDs with messages in Redis
      const conversationIds = await this._redisService.getActiveConversations();
      if (conversationIds.length === 0) {
        logger.info('📭 No pending messages to process.');
        this.isProcessing = false;
        return;
      }

      for (const conversationId of conversationIds) {
        // Distributed lock to prevent duplicate processing in multi-node setup
        const lockKey = `lock:${conversationId}`;
        const lockAcquired = await this._redisService.acquireLock(lockKey, 5000); // 5-sec expiry
        if (!lockAcquired) continue; // Skip if another instance is processing

        try {
          const messages = await this._redisService.fetchMessagesByConversationId(
            conversationId,
            null,
            Number(config.messageBatchSize),
          );

          if (messages.length === 0) continue;

          await this._messageRepository.insertMany(messages);
          await this._redisService.removeMessages(
            conversationId,
            messages[messages.length - 1].messageId,
          );
          logger.info(`✅ Inserted ${messages.length} messages for conversation ${conversationId}`);
        } catch (error) {
          logger.error(`❌ Failed to process batch for ${conversationId}: ${error}`);
        } finally {
          await this._redisService.releaseLock(lockKey);
        }
      }
    } catch (error) {
      logger.error(`❌ Batch Processor Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Starts the cron job for batch processing.
   */
  private startCronJob(): void {
    const interval = config.cronSchedule || '*/1 * * * * *';

    cron.schedule(interval, async () => {
      await this.processBatch();
    });

    logger.info(`🟢 Batch Processor Cron job scheduled: ${interval}`);
  }
}
