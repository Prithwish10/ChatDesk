import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../loaders/logger";
import { signupSchema } from "../utils/validations/signup.validation.schema";
import { SignupService } from "../services/Signup.service";

@Service()
export class SignUpController {
  constructor(private readonly _signupService: SignupService) {}

  public async signup(req: Request, res: Response, next: NextFunction) {
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
