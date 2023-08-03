import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Api400Error } from "@pdchat/common";
import { logger } from "../loaders/logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { PasswordManager } from "./PasswordManager.service";
import { UserAttrs } from "../interfaces/User";

@Service()
export class SigninService {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Authenticates a user by their email and password, generating a JSON Web Token (JWT) upon successful authentication.
   * @async
   * @param {string} email - The email address of the user attempting to sign in.
   * @param {string} password - The plaintext password provided by the user for authentication.
   * @returns {Promise<{ user: UserAttrs, userJwt: string }>} A Promise that resolves to an object containing the authenticated user and their corresponding JWT (JSON Web Token).
   * @throws {Api400Error} If the provided credentials are invalid (email not found or password does not match).
   * @throws {Error} Any other error that occurs during the authentication process.
   */
  public async signin(email: string, password: string): Promise<{ user: UserAttrs, userJwt: string }> {
    try {
      const existingUser = await this._userRepository.findUserByEmail(email);

      if (!existingUser) {
        throw new Api400Error("Invalid credentials.");
      }

      const passwordMatch = await PasswordManager.compare(
        existingUser.password,
        password
      );

      if (!passwordMatch) {
        throw new Api400Error("Invalid credentials.");
      }

      const userJwt = jwt.sign(
        {
          id: existingUser.id,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
        },
        config.jwtSecret!
      );

      return { user: existingUser, userJwt };
    } catch (error) {
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
