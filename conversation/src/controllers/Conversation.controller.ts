import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/Conversation.service';

@Service()
export class ConversationController {
  constructor(private readonly _conversationService: ConversationService) {}

  public async getByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const sort = (req.query.sort as string) || 'last_message_timestamp';
      const order = (req.query.order as string) || 'desc';
      const cursor = req.query.cursor ? JSON.parse(req.query.cursor as string) : null;
      const deleted = parseInt(req.query.deleted as string) || 0;
      let limit = parseInt(req.query.limit as string) || 20;
      if (limit > 100) {
        limit = 20;
      }

      const userConversations = await this._conversationService.getByUserId(
        userId,
        sort,
        order,
        limit,
        cursor,
        deleted,
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        ...userConversations,
      });
    } catch (error) {
      next(error);
    }
  }
}
