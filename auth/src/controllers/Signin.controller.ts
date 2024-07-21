import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../loaders/logger';
import { signinSchema } from '../utils/validations/signin.validation.schema';
import { SigninService } from '../services/Signin.service';

@Service()
export class SignInController {
  constructor(private readonly _signinService: SigninService) {}

  /**
   * Handles user sign-in process.
   * Validates the request body using `signinSchema`.
   * If successful, authenticates the user and generates a JWT using `signinService`.
   * Stores the user's JWT in the session.
   * Sends a success response to the client with user information.
   * If an error occurs, logs the error and passes it to the next error-handling middleware or error handler.
   *
   * @param {Request} req - The Express Request object representing the HTTP request.
   * @param {Response} res - The Express Response object representing the HTTP response.
   * @param {NextFunction} next - The Express NextFunction middleware for passing control to the next middleware.
   * @returns {Promise<Response | void>} A Promise that resolves to the Express Response object containing the response data.
   * @throws {Error} If any error occurs during the signin process, it is passed to the Express `next` function for error handling.
   */
  public async signin(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      await signinSchema.validateAsync(req.body);
      const { email, password } = req.body;
      const { user, userJwt } = await this._signinService.signin(email, password);

      req.session = {
        jwt: userJwt,
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        user,
      });
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
