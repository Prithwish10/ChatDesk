import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import Logger from "../loaders/Logger";
import { signupSchema } from "../utils/validations/signup.validation.schema";

@Service()
export class SignUpController {
  constructor(
    // private readonly messageService: MessageService,
    private readonly logger: Logger
  ) {}

  public async signup(req: Request, res: Response, next: NextFunction) {
    try {
      await signupSchema.validateAsync(req.body);

      return res.status(201).json({
        success: true,
        statusCode: 201,
        message: "Signup",
      });
    } catch (error) {
      this.logger.error(`Error in signup controller: ${error} `);
      next(error);
    }
  }
}
