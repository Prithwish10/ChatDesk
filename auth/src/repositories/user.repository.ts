import { Service } from "typedi";
import Logger from "../loaders/Logger";
import UserModel from "../models/User.model";
import { User } from "../interfaces/User";

@Service()
export class UserRepository {
  constructor(private readonly logger: Logger) {}

  public async findUserByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email });
      return user;
    } catch (error) {
      this.logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  public async findUserByMobileNumber(mobileNumber: string) {
    try {
      const user = await UserModel.findOne({ mobileNumber });
      return user;
    } catch (error) {
      this.logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  public async createUser(user: User) {
    try {
      const newUser = await UserModel.create(user);
      return newUser;
    } catch (error) {
      this.logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }
}
