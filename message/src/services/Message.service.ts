import { Service } from 'typedi';
import { MessageRepository } from '../repositories/Message.repository';
import { RedisService } from './Redis.service';
import { logger } from '../loaders/logger';

@Service()
export class MessageService {
  constructor(
    private readonly _messageRepository: MessageRepository,
    private readonly _redisService: RedisService,
  ) {}

  async getByConversationId(
    conversationId: string,
    sort: string,
    order: string,
    cursor: string | null,
    limit: number,
  ) {
    try {
      let redisMessages = await this._redisService.fetchMessagesByConversationId(conversationId, cursor, limit);

      let dbMessages: any[] = [];
      if (redisMessages.length < limit) {
        const query: any = { conversationId };
        if (cursor) query.messageId = { $gt: cursor };

        dbMessages = await this._messageRepository.find(
          query,
          sort,
          order,
          limit - redisMessages.length,
        );
      }
      const allMessages = [...redisMessages, ...dbMessages].sort(
        (a, b) => a.messageId - b.messageId,
      );
      const nextCursor = allMessages.length > 0 ? allMessages.at(-1)?.messageId : null;

      return { messages: allMessages, cursor: nextCursor };
    } catch (error) {
      logger.error(`Error in service while fetching messages: ${error}`);
      throw error;
    }
  }
}
