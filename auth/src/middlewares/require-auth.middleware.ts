import { Request, Response, NextFunction } from "express";
import Logger from "../loaders/Logger";
import { Api401Error } from "../utils/errors/Api401Error";

const logger = Logger.getInstance();

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new Api401Error("User not authorised.");
  }

  next();
};
