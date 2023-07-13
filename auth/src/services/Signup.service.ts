import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Api409Error } from "@pdchat/common";
import { Logger } from "@pdchat/common";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";

@Service()
export class SignupService {
  private readonly _logger: Logger;

  constructor(private readonly _userRepository: UserRepository) {
    this._logger = Logger.getInstance(config.servicename);
  }

  public async signup(
    firstName: string,
    lastName: string,
    image: string,
    mobileNumber: string,
    email: string,
    password: string
  ) {
    try {
      const existingUserWithEmail = await this._userRepository.findUserByEmail(
        email
      );

      if (existingUserWithEmail) {
        throw new Api409Error("Email already in use.");
      }

      const existingUserWithMobileNumber =
        await this._userRepository.findUserByMobileNumber(mobileNumber);

      if (existingUserWithMobileNumber) {
        throw new Api409Error("Mobile number already in use.");
      }

      const user = await this._userRepository.createUser({
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
      this._logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
