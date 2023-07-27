import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../loaders/logger";
import { signupSchema } from "../utils/validations/signup.validation.schema";
import { SignupService } from "../services/Signup.service";

@Service()
export class SignUpController {
  constructor(private readonly _signupService: SignupService) {}

  /**
   * Controller function to handle user signup request.
   * Validates the request body against the signupSchema, and then invokes the signup service to create a new user account.
   * If signup is successful, the function sets the user's session with the generated JWT and returns the user data in the response.
   * @async
   * @param {Request} req - The Express Request object representing the HTTP request.
   * @param {Response} res - The Express Response object representing the HTTP response.
   * @param {NextFunction} next - The Express NextFunction middleware for passing control to the next middleware.
   * @returns {Promise<Response | void>} A Promise that resolves to the Express Response object containing the response data.
   * @throws {Error} If any error occurs during the signup process, it is passed to the Express `next` function for error handling.
   */
  public async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await signupSchema.validateAsync(req.body);
      const { firstName, lastName, image, mobileNumber, email, password } =
        req.body;

      const { user, userJwt } = await this._signupService.signup(
        firstName,
        lastName,
        image,
        mobileNumber,
        email,
        password
      );

      req.session = {
        jwt: userJwt,
      };

      return res.status(201).json({
        success: true,
        statusCode: 201,
        user,
      });
    } catch (error) {
      logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
