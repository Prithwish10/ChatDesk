import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../loaders/logger";
import { UserService } from "../services/User.service";

@Service()
export class UserController {
  constructor(private readonly _userService: UserService) {}

  /**
   * Controller function to handle fetching the current authenticated user's data.
   * Responds with a JSON object containing the current user's data or null if the user is not authenticated.
   * @param {Request} req - The Express Request object representing the HTTP request.
   * @param {Response} res - The Express Response object representing the HTTP response.
   * @param {NextFunction} next - The Express NextFunction middleware for passing control to the next middleware.
   * @returns {Promise<Response | void>} A Promise that resolves to the Express Response object containing the JSON response data.
   * @throws {Error} If any error occurs during the processing, it is passed to the Express `next` function for error handling.
   */
  public async currentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
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
}
