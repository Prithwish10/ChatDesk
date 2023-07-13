import { Service } from "typedi";
import { Logger } from "@pdchat/common";
import UserModel from "../models/User.model";
import { User } from "../interfaces/User";
import config from "../config/config.global";

@Service()
export class UserRepository {
  private readonly _logger: Logger;

  constructor() {
    this._logger = Logger.getInstance(config.servicename);
  }

  public async findUserByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      this._logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  public async findUserByMobileNumber(mobileNumber: string) {
    try {
      const user = await UserModel.findOne({ mobileNumber });
      return user;
    } catch (error) {
      this._logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  public async createUser(user: User) {
    try {
      const newUser = await UserModel.create(user);
      return newUser;
    } catch (error) {
      this._logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }
}
