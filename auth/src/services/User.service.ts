import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { logger } from "../loaders/logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { UserPayload } from "../interfaces/UserPayload";

@Service()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}

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
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }

  public async search(
    keyword: string,
    userId: string,
    currentPage: number,
    pageSize: number,
    order: string,
    sort: string
  ) {
    try {
      let response: any = {};
      if (!keyword) {
        response = await this._userRepository.getUserSearchHistory(
          userId,
          currentPage,
          pageSize,
          order,
          sort
        );
      } else {
        response = await this._userRepository.search(
          keyword,
          currentPage,
          pageSize,
          order,
          sort
        );
      }

      return response;
    } catch (error) {
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
