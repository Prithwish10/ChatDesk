import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@pdchat/common";
import { UserService } from "../services/User.service";
import config from "../config/config.global";

@Service()
export class UserController {
  private readonly _logger: Logger;

  constructor(private readonly _userService: UserService) {
    this._logger = Logger.getInstance(config.servicename);
  }

  public async currentUser(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentUser: req.currentUser || null,
      });
    } catch (error) {
      this._logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
