import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import { Logger } from "@pdchat/common";
import { signupSchema } from "../utils/validations/signup.validation.schema";
import { SignupService } from "../services/Signup.service";
import config from "../config/config.global";

@Service()
export class SignUpController {
  private readonly _logger: Logger;

  constructor(private readonly _signupService: SignupService) {
    this._logger = Logger.getInstance(config.servicename);
  }

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
      this._logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
