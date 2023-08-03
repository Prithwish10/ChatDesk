import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ConversationService } from "../../services/Conversation.service";
import { createConversationSchema } from "../../utils/validation/conversation.validation.schema";
import { logger } from "../../loaders/logger";
import { ConversationAttrs } from "../../interfaces/v1/Conversation";
import { Participant } from "../../interfaces/v1/Participant";
import { addParticipantsToConversationSchema } from "../../utils/validation/participant-added.validation.schema";

@Service()
export class ConversationController {
  constructor(private readonly _conversationService: ConversationService) {}

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      await createConversationSchema.validateAsync(req.body);
      const { conversation, isNew } = await this._conversationService.create(
        req.body,
        req.currentUser!.id
      );

      if (!isNew) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          conversation,
        });
      }

      return res.status(201).json({
        success: true,
        statusCode: 201,
        conversation,
      });
    } catch (error) {
      logger.error(
        `Error in controller while creating conversation: ${error} `
      );
      next(error);
    }
  }

  public async getUserConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const sort = (req.query.sort as string) || "last_message_timestamp";
      const order = (req.query.order as string) || "desc";
      const page = parseInt(req.query.page as string) || 1;
      const deleted = parseInt(req.query.deleted as string) || 0;
      let limit = parseInt(req.query.limit as string) || 20;
      if (limit > 100) {
        limit = 20;
      }

      const userConversation =
        await this._conversationService.getUserConversations(
          req.params.id,
          sort,
          order,
          page,
          limit,
          deleted
        );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentPage: page,
        ...userConversation,
      });
    } catch (error) {
      logger.error(
        `Error in controller while fetching user conversations: ${error} `
      );
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const conversation = await this._conversationService.getById(
        req.params.id as string
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation,
      });
    } catch (error) {
      logger.error(
        `Error in controller while fetching conversation by Id: ${error} `
      );
      next(error);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedConversation = await this._conversationService.updateById(
        req.params.id as string,
        req.body as ConversationAttrs
      );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation: updatedConversation,
      });
    } catch (error) {
      logger.error(
        `Error in controller while updating conversation: ${error} `
      );
      next(error);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      await this._conversationService.deleteById(req.params.id as string);

      return res.status(204).json({
        success: true,
        statusCode: 204,
      });
    } catch (error) {
      logger.error(
        `Error in controller while deleting conversation: ${error} `
      );
      next(error);
    }
  }

  public async addParticipantsToConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await addParticipantsToConversationSchema.validateAsync(req.body);

      const conversationWithUpdatedParticipants =
        await this._conversationService.addParticipantsToConversation(
          req.params.id as string,
          req.body.participants as Participant[],
          req.currentUser!.id as string
        );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation: conversationWithUpdatedParticipants,
      });
    } catch (error) {
      logger.error(
        `Error in controller while add participants to conversation: ${error} `
      );
      next(error);
    }
  }

  public async removeParticipantFromConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const conversationWithUpdatedParticipants =
        await this._conversationService.removeParticipantsFromConversation(
          req.params.conversation_id as string,
          req.params.user_id as string,
          req.currentUser!.id as string
        );

      return res.status(200).json({
        success: true,
        statusCode: 200,
        conversation: conversationWithUpdatedParticipants,
      });
    } catch (error) {
      logger.error(
        `Error in controller while add participants to conversation: ${error} `
      );
      next(error);
    }
  }
}
