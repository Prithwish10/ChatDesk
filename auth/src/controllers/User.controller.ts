import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../loaders/logger";
import { UserService } from "../services/User.service";

@Service()
export class UserController {
  constructor(private readonly _userService: UserService) {}

  public async currentUser(req: Request, res: Response, next: NextFunction) {
    try {
      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentUser: req.currentUser || null,
      });
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }

  public async search(req: Request, res: Response, next: NextFunction) {
    try {
      const keyword = req.query.keyword as string;
      const sort = (req.query.sort as string) || "created_at";
      const order = (req.query.order as string) || "desc";
      const page = parseInt(req.query.page as string) || 1;
      let limit = parseInt(req.query.limit as string) || 30;
      if (limit > 100) {
        limit = 30;
      }

      const searchResult = await this._userService.search(
        req.currentUser!.id,
        keyword,
        page,
        limit,
        order,
        sort
      );
      return res.status(200).json({
        success: true,
        statusCode: 200,
        currentUser: req.currentUser || null,
      });
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
