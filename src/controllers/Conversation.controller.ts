import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { ConversationService } from "../services/Conversation.service";

@Service()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  public async create(req: Request, res: Response, next: NextFunction) {}

  public async get(req: Request, res: Response, next: NextFunction) {}

  public async getById(req: Request, res: Response, next: NextFunction) {}

  public async updateById(req: Request, res: Response, next: NextFunction) {}

  public async deleteById(req: Request, res: Response, next: NextFunction) {}
}
