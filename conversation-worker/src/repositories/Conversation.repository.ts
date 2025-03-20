import { Service } from 'typedi';
import { MongooseBulkWriteOptions } from 'mongoose';
import { Conversation } from '../models/Conversation.model';
import { logger } from '../loaders/logger';

@Service()
export class ConversationRepository {
  constructor() {}

  /**
   * Executes a bulk write operation on the Conversation model.
   * @param operation - The bulk write operations to perform.
   * @param option - The bulk write options.
   * @returns A promise that resolves when the bulk write operation is complete.
   * @throws error - If the bulk write operation fails.
   */
  public async bulkInsert(operation: any[]) {
    try {
      await Conversation.bulkWrite(operation, { ordered: false });
      logger.info(`✅ Bulk updated ${operation.length} conversations.`);
    } catch (error) {
      logger.error(`❌ Bulk write error: ${error}`);
      throw error;
    }
  }
}
