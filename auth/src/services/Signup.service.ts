import { Service } from "typedi";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { Api409Error } from "@pdchat/common";
import { logger } from "../loaders/logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { UserCreatedPublisher } from "../events/publishers/User-created-publisher";
import { natsWrapper } from "../loaders/NatsWrapper";
import { User } from "../interfaces/User";

@Service()
export class SignupService {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Creates a new user account and performs user signup.
   * @async
   * @param {string} firstName - The first name of the user.
   * @param {string} lastName - The last name of the user.
   * @param {string} image - The user's image (avatar) as a URL or base64 encoded string.
   * @param {string} mobileNumber - The mobile number of the user.
   * @param {string} email - The email address of the user.
   * @param {string} password - The plaintext password provided by the user for the new account.
   * @returns {Promise<{ user: User, userJwt: string }>} A Promise that resolves to an object containing the newly created user and their corresponding JWT (JSON Web Token) after successful signup.
   * @throws {Api409Error} If there is an existing user with the same email or mobile number, indicating a conflict.
   * @throws {Error} Any other error that occurs during the signup process.
   */
  public async signup(
    firstName: string,
    lastName: string,
    image: string,
    mobileNumber: string,
    email: string,
    password: string
  ): Promise<{ user: User; userJwt: string }> {
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
        id: user.id!.toString(),
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
