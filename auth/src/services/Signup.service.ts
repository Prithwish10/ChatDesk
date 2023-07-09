import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Api409Error } from "@pdchat/common";
import Logger from "../loaders/Logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";

@Service()
export class SignupService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  public async signup(
    firstName: string,
    lastName: string,
    image: string,
    mobileNumber: string,
    email: string,
    password: string
  ) {
    try {
      const existingUserWithEmail = await this.userRepository.findUserByEmail(
        email
      );

      if (existingUserWithEmail) {
        throw new Api409Error("Email already in use.");
      }

      const existingUserWithMobileNumber =
        await this.userRepository.findUserByMobileNumber(mobileNumber);

      if (existingUserWithMobileNumber) {
        throw new Api409Error("Mobile number already in use.");
      }

      const user = await this.userRepository.createUser({
        firstName,
        lastName,
        image,
        mobileNumber,
        email,
        password,
      });

      const userJwt = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        config.jwtSecret!
      );

      return { user, userJwt };
    } catch (error) {
      this.logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
