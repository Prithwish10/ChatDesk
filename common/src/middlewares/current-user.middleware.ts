import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.global";
import { Logger } from "../utils/Logger";
import { UserPayload } from "../interfaces/UserPayload";

const logger = Logger.getInstance();

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * Middleware to check if the current user is authenticated by verifying the JSON Web Token (JWT) stored in the session.
 * If a valid JWT is found, the user payload is extracted and stored in the `req.currentUser` property for further use.
 * If no JWT is found, the middleware simply proceeds to the next middleware or route handler.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param next - The callback function to invoke to pass control to the next middleware or route handler.
 * @returns This function does not have a return value.
 */
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if a JWT is stored in the session
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // Verify the JWT using the jwtSecret
    const payload = jwt.verify(
      req.session.jwt,
      config.jwtSecret!
    ) as UserPayload;

    // Store the user payload in the request object for future use
    req.currentUser = payload;
  } catch (error) {
    logger.error(`Error in currentuser middleware: ${error}`);
  }

  // Proceed to the next middleware or route handler
  next();
};
