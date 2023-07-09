import { Service } from "typedi";
import jwt from "jsonwebtoken";
import { Api400Error } from "@pdchat/common";
import Logger from "../loaders/Logger";
import { UserRepository } from "../repositories/user.repository";
import config from "../config/config.global";
import { PasswordManager } from "./PasswordManager.service";

@Service()
export class SigninService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logger: Logger
  ) {}

  public async signin(email: string, password: string) {
    try {
      const existingUser = await this.userRepository.findUserByEmail(email);

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
      this.logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }
}
