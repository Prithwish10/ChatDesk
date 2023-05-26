import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ConversationService } from "../../services/Conversation.service";
import { createConversationSchema } from "../../utils/validation/conversation.validation.schema";
import Logger from "../../loaders/Logger";
import { Conversation } from "../../interfaces/v1/Conversation";

@Service()
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly logger: Logger
  ) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await createConversationSchema.validateAsync(req.body);
      const newConversation = await this.conversationService.create(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        conversation: newConversation,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating conversation: ${error} `
      );
      next(error);
    }
  }

  public async getUserConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const sort = req.query.sort as string || 'last_message_timestamp';
      const order = req.query.order as string || 'desc';
      const page = parseInt(req.query.page as string) || 1;
      const deleted = parseInt(req.query.deleted as string) || 0;
      let limit = parseInt(req.query.limit as string) || 20;
      if(limit > 100) {
        limit = 20
      }
      
      const userConversation = await this.conversationService.getUserConversations(req.params.id, sort, order, page, limit, deleted);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentPage: page,
        ...userConversation,
        
      });
    } catch(error) {
      this.logger.error(
        `Error in controller while fetching user conversations: ${error} `
      );
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {}

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await this.conversationService.getById(
        req.params.id as string
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while fetching conversation by Id: ${error} `
      );
      next(error);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedConversation = await this.conversationService.updateById(
        req.params.id as string,
        req.body as Conversation
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation: updatedConversation,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while updating conversation: ${error} `
      );
      next(error);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.conversationService.deleteById(
        req.params.id as string
      );

      return res.status(204).json({
        success: true,
        statusCode: 204
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while deleting conversation: ${error} `
      );
      next(error);
    }
  }
}
