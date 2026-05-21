import cron from 'node-cron';
import config from '../config/config.global';
import { RedisService } from './Redis.service';
import { ConversationRepository } from '../repositories/Conversation.repository';
import { logger } from '../loaders/logger';
import { Inject, Service } from 'typedi';
import { RedisKeyUtil } from '../utils/Redis.util';

@Service()
export class BatchProcessor {
  private isProcessing = false; // Prevent overlapping executions
  private BATCH_SIZE = 1000;

  constructor(
    @Inject(() => RedisService) private _redisService: RedisService,
    @Inject(() => ConversationRepository) private _conversationRepository: ConversationRepository,
  ) {
    this.startCronJob();
  }

  /**
   * Fetches messages per conversation and inserts them into MongoDB in batches.
   */
  public async processBatch(): Promise<void> {
    if (this.isProcessing) return; // Prevent parallel execution
    this.isProcessing = true;
    logger.info('⏳ Starting batch processing...');

    try {
      while (true) {
        // Fetch a batch of active conversations
        const activeConversations = await this._redisService.getActiveConversationsBatch(
          this.BATCH_SIZE,
        );
        if (activeConversations.length === 0) break;

        await this.processConversations(activeConversations);
      }
    } catch (error) {
      logger.error(`❌ Batch Processor Error: ${error}`);
    } finally {
      this.isProcessing = false;
    }
  }

  private async processConversations(conversationIds: string[]): Promise<void> {
    const updates: any[] = [];
    const pipeline = this._redisService.pipeline();

    await Promise.all(
      conversationIds.map(async (conversationId) => {
        const lockKey = `lock:conv:${conversationId}`;
        const lockAcquired = await this._redisService.acquireLock(lockKey, 5000); // 5-sec expiry
        if (!lockAcquired) return; // Skip if another instance is processing

        try {
          const latestMessage = await this._redisService.fetchLatestMessage(conversationId);
          if (!latestMessage) return;

          // Prepare bulk update for DB
          updates.push({
            updateOne: {
              filter: { _id: latestMessage.conversationId },
              update: {
                $set: {
                  lastMessage: latestMessage.lastMessage,
                  lastMessageAt: latestMessage.lastMessageAt,
                },
              },
            },
          });

          // Remove processed messages from Redis
          pipeline.zremrangebyscore(
            RedisKeyUtil.lastMessageUpdate(conversationId),
            '-inf',
            latestMessage.lastMessageAt.toString(),
          );
          await this._redisService.markConversationProcessed(conversationId);
        } catch (error) {
          logger.error(`❌ Error processing ${conversationId}: ${error}`);
        } finally {
          await this._redisService.releaseLock(lockKey);
        }
      }),
    );

    if (updates.length > 0) {
      await this._conversationRepository.bulkWrite(updates, { ordered: false }); // Perform bulk DB update
      await pipeline.exec(); // Execute Redis batch operations
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
