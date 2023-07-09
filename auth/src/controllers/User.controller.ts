import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import Logger from "../loaders/Logger";
import { UserService } from "../services/User.service";

@Service()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger
  ) {}

  public async currentUser(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentUser: req.currentUser || null,
      });
    } catch (error) {
      this.logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
