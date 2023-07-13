import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Logger } from "@pdchat/common";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { UserPayload } from "../interfaces/UserPayload";

@Service()
export class UserService {
  private readonly _logger: Logger;

  constructor(private readonly _userRepository: UserRepository) {
    this._logger = Logger.getInstance(config.servicename);
  }

  public async currentUser(jwtToken: string) {
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
      this._logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
