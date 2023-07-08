import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import Logger from "../loaders/Logger";

@Service()
export class SignoutController {
  constructor(
    private readonly logger: Logger
  ) {}

  public signout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session = null;
      
      return res.send({});
    } catch (error) {
      this.logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
