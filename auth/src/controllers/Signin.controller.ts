import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import Logger from "../loaders/Logger";
import { signinSchema } from "../utils/validations/signin.validation.schema";
import { SigninService } from "../services/Signin.service";

@Service()
export class SignInController {
  constructor(
    private readonly signinService: SigninService,
    private readonly logger: Logger
  ) {}

  public async signin(req: Request, res: Response, next: NextFunction) {
    try {
      await signinSchema.validateAsync(req.body);
      const { email, password } = req.body;
      const {user, userJwt} = await this.signinService.signin(email, password);

      req.session = {
        jwt: userJwt,
      };

      return res.status(200).json({
        success: true,
        statusCode: 200,
        user,
      });
    } catch (error) {
      this.logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
