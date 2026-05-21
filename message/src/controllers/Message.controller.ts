import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import { MessageService } from '../services/Message.service';
import { logger } from '../loaders/logger';

@Service()
export class MessageController {
  constructor(private readonly _messageService: MessageService) {}

  /**
   * Retrieves messages for a specific conversation, using pagination and sorting.
   *
   * @param {Request} req - The Express request object containing information about the incoming HTTP request.
   * @param {Response} res - The Express response object used to send the response back to the client.
   * @param {NextFunction} next - The callback function to proceed to the next middleware or route handler.
   *
   * @throws {Error} If there's an error during the message retrieval process in the `messageController`.
   */
  public async getByConversationId(req: Request, res: Response, next: NextFunction) {
    try {
      const conversationId = req.params.conversationId;
      const limit = parseInt(req.query.limit as string) || 50;
      const cursor = req.query.cursor as string | null;
      const sort = (req.query.sort as string) || 'messageId';
      const order = (req.query.order as string) || 'asc';

      const messages = await this._messageService.getByConversationId(
        conversationId,
        sort,
        order,
        cursor,
        limit,
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        ...messages,
      });
    } catch (error) {
      logger.error(`Error in controller while fetching messages: ${error} `);
      next(error);
    }
  }
}
