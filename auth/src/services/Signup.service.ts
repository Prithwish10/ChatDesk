import { Service } from "typedi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Api409Error } from "@pdchat/common";
import { logger } from "../loaders/logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { UserCreatedPublisher } from "../events/publishers/User-created-publisher";
import { natsWrapper } from "../loaders/NatsWrapper";

@Service()
export class SignupService {
  constructor(private readonly _userRepository: UserRepository) {}

  public async signup(
    firstName: string,
    lastName: string,
    image: string,
    mobileNumber: string,
    email: string,
    password: string
  ) {
    const SESSION = await mongoose.startSession();
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

      SESSION.startTransaction();

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

      await new UserCreatedPublisher(natsWrapper.client).publish({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });

      await SESSION.commitTransaction();
      logger.info("User signed up successfully!");

      return { user, userJwt };
    } catch (error) {
      // CATCH ANY ERROR DUE TO TRANSACTION
      await SESSION.abortTransaction();
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    } finally {
      // FINALIZE SESSION
      SESSION.endSession()
    }
  }
}
