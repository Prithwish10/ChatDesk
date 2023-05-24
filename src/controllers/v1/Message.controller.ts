import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { MessageService } from "../../services/Message.service";

@Service()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  public async create(req: Request, res: Response, next: NextFunction) {}

  public async get(req: Request, res: Response, next: NextFunction) {}

  public async getById(req: Request, res: Response, next: NextFunction) {}

  public async updateById(req: Request, res: Response, next: NextFunction) {}

  public async deleteById(req: Request, res: Response, next: NextFunction) {}
}
