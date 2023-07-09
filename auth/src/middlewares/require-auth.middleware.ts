import { Request, Response, NextFunction } from "express";
import { Api401Error } from "../utils/errors/Api401Error";

/**
 * Middleware to check if the current user is authenticated.
 * If the `req.currentUser` property is not set, it indicates that the user is not authorized, and a 401 Unauthorized error is thrown.
 * If the user is authorized, the control is passed to the next middleware or route handler.
 *
 * @param req - The Express.js request object.
 * @param res - The Express.js response object.
 * @param next - The callback function to invoke to pass control to the next middleware or route handler.
 * @throws {Api401Error} If the current user is not authorized.
 * @returns This function does not have a return value.
 */

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the current user is authorized
  if (!req.currentUser) {
    throw new Api401Error("User not authorized.");
  }

  // Proceed to the next middleware or route handler
  next();
};
