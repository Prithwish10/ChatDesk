import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.global";
import Logger from "../loaders/Logger";
import { UserPayload } from "../interfaces/UserPayload";

const logger = Logger.getInstance();

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      config.jwtSecret!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (error) {
    logger.error(`Error in currentuser middleware: ${error}`);
  }

  next();
};
