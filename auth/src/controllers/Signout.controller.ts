import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../loaders/logger";

@Service()
export class SignoutController {
  constructor() {}

  public signout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session = null;

      return res.send({});
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
