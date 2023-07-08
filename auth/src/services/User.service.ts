import { Service } from "typedi";
import jwt from "jsonwebtoken";
import Logger from "../loaders/Logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  public async currentUser(jwtToken: string) {
    try {
      if (!jwtToken) {
        return null;
      }

      let payload: string | jwt.JwtPayload;
      try {
        payload = jwt.verify(jwtToken, config.jwtSecret!);
      } catch (error) {
        return null;
      }

      return payload;
    } catch (error) {
      this.logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
