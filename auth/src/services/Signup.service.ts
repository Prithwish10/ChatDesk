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
    } catch (error) {
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }

    const SESSION = await mongoose.startSession();
    try {
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
      logger.info("User signup event sent successfully!");

      return { user, userJwt };
    } catch (error) {
      // catch any error due to transaction
      await SESSION.abortTransaction();
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    } finally {
      // finalize session
      SESSION.endSession();
    }
  }
}
