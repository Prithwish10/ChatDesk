import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { MessageService } from "../../services/Message.service";
import { logger } from "../../loaders/logger";
import { createMessageSchema } from "../../utils/validation/message.validation.schema";
import { MessageAttrs } from "../../interfaces/v1/Message";

@Service()
export class MessageController {
  constructor(private readonly _messageService: MessageService) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await createMessageSchema.validateAsync(req.body);
      const newMessage = await this._messageService.create(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: newMessage,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const sort = (req.query.sort as string) || "created_at";
      const order = (req.query.order as string) || "desc";
      const page = parseInt(req.query.page as string) || 1;
      const deleted = parseInt(req.query.deleted as string) || 0;
      let limit = parseInt(req.query.limit as string) || 30;
      if (limit > 100) {
        limit = 30;
      }
      const messages = await this._messageService.getMessagesForAConversation(
        req.params.id as string,
        sort,
        order,
        page,
        limit,
        deleted
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        ...messages,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await this._messageService.getById(
        req.params.id as string
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedMessage = await this._messageService.updateById(
        req.params.id as string,
        req.body as MessageAttrs
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: updatedMessage,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this._messageService.deleteById(req.params.id as string);

      return res.status(204).json({
        success: true,
        statusCode: 204,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating message: ${error} `
      );
      next(error);
    }
  }
}
