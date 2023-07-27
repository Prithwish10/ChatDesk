import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { logger } from "../loaders/logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { UserPayload } from "../interfaces/UserPayload";

@Service()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Retrieves the user payload from a given JSON Web Token (JWT) for the current user.
   * @async
   * @param {string} jwtToken - The JSON Web Token representing the user's authentication.
   * @returns {Promise<UserPayload | null>} A Promise that resolves to the user payload (decoded data) from the provided JWT if valid, or null if the JWT is invalid or not provided.
   * @throws {Error} Any error that occurs during the JWT verification process.
   */
  public async currentUser(jwtToken: string): Promise<UserPayload | null> {
    try {
      if (!jwtToken) {
        return null;
      }

      let payload: UserPayload;
      try {
        payload = jwt.verify(jwtToken, config.jwtSecret!) as UserPayload;
      } catch (error) {
        return null;
      }

      return payload;
    } catch (error) {
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
