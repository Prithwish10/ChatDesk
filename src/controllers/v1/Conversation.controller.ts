import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ConversationService } from "../../services/Conversation.service";
import { createConversationSchema } from "../../utils/validation/conversation.validation.schema";
import Logger from "../../loaders/Logger";

const logger = Logger.getInstance();

@Service()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

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
      logger.error(
        `Error in controller while creating conversation: ${error} `
      );
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {}

  public async getById(req: Request, res: Response, next: NextFunction) {}

  public async updateById(req: Request, res: Response, next: NextFunction) {}

  public async deleteById(req: Request, res: Response, next: NextFunction) {}
}
