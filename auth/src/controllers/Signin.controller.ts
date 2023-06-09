import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@pdchat/common";
import { signinSchema } from "../utils/validations/signin.validation.schema";
import { SigninService } from "../services/Signin.service";
import config from "../config/config.global";

@Service()
export class SignInController {
  private readonly _logger: Logger;

  constructor(private readonly _signinService: SigninService) {
    this._logger = Logger.getInstance(config.servicename);
  }

  /**
   * Handles user sign-in process.
   * Validates the request body using `signinSchema`.
   * If successful, authenticates the user and generates a JWT using `signinService`.
   * Stores the user's JWT in the session.
   * Sends a success response to the client with user information.
   * If an error occurs, logs the error and passes it to the next error-handling middleware or error handler.
   *
   * @param req - Express.js request object.
   * @param res - Express.js response object.
   * @param next - Callback function to pass control to the next middleware or error handler.
   * @returns If sign-in is successful, sends a success response to the client. Otherwise, passes the error to the next error-handling middleware or error handler.
   */
  public async signin(req: Request, res: Response, next: NextFunction) {
    try {
      await signinSchema.validateAsync(req.body);
      const { email, password } = req.body;
      const { user, userJwt } = await this._signinService.signin(
        email,
        password
      );

      req.session = {
        jwt: userJwt,
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        user,
      });
    } catch (error) {
      this._logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
