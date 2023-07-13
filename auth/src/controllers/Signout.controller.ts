import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@pdchat/common";
import config from "../config/config.global";

@Service()
export class SignoutController {
  private readonly _logger: Logger;

  constructor() {
    this._logger = Logger.getInstance(config.servicename);
  }

  public signout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session = null;

      return res.send({});
    } catch (error) {
      this._logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
