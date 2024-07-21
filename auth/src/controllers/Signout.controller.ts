import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../loaders/logger';

@Service()
export class SignoutController {
  constructor() {}

  /**
   * Controller function to handle user signout request.
   * Clears the user's session by setting it to null, and returns a 204 No Content response to indicate successful signout.
   * @param {Request} req - The Express Request object representing the HTTP request.
   * @param {Response} res - The Express Response object representing the HTTP response.
   * @param {NextFunction} next - The Express NextFunction middleware for passing control to the next middleware.
   * @returns {void} This function does not return a Promise and has no meaningful return value.
   * @throws {Error} If any error occurs during the signout process, it is passed to the Express `next` function for error handling.
   */
  public signout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session = null;

      return res.status(204).send();
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
