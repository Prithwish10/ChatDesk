import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { MessageService } from "../../services/Message.service";
import Logger from "../../loaders/Logger";
import { createMessageSchema } from "../../utils/validation/message.validation.schema";
import { Message } from "../../interfaces/v1/Message";

@Service()
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly logger: Logger
  ) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await createMessageSchema.validateAsync(req.body);
      const newMessage = await this.messageService.create(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: newMessage,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await this.messageService.getMessagesForAConversation(
        req.query.conversation_id as string
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        messages,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await this.messageService.getById(
        req.params.id as string
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedMessage = await this.messageService.updateById(
        req.params.id as string,
        req.body as Message
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: updatedMessage,
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this.messageService.deleteById(
        req.params.id as string
      );

      return res.status(204).json({
        success: true,
        statusCode: 204
      });
    } catch (error) {
      this.logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }
}
