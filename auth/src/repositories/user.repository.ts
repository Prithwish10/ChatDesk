import { Service } from "typedi";
import { Logger } from "@pdchat/common";
import UserModel from "../models/User.model";
import { User } from "../interfaces/User";
import config from "../config/config.global";
import SearchHistoryModel from "../models/Search-history.model";
import { SortOrder } from "mongoose";

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
      this._logger.error(
        `Error occured while fetching user by email: ${error}`
      );
      throw error;
    }
  }

  public async findUserByMobileNumber(mobileNumber: string) {
    try {
      const user = await UserModel.findOne({ mobileNumber });
      return user;
    } catch (error) {
      this._logger.error(
        `Error occured while fetching user by mobile number: ${error}`
      );
      throw error;
    }
  }

  public async createUser(user: User) {
    try {
      const newUser = await UserModel.create(user);
      return newUser;
    } catch (error) {
      this._logger.error(`Error occured while creating user: ${error}`);
      throw error;
    }
  }

  public async search(
    keyword: string,
    currentPage: number,
    pageSize: number,
    order: string,
    sort: string
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;
      const regex = new RegExp("^" + keyword, "i");

      const users = await UserModel.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      })
        .skip((currentPage - 1) * pageSize)
        .sort(sortConfig)
        .limit(pageSize);

      return users;
    } catch (error) {
      this._logger.error(`Error occured while searching user: ${error}`);
      throw error;
    }
  }

  public async getUserSearchHistory(
    userId: string,
    currentPage: number,
    pageSize: number,
    order: string,
    sort: string
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;

      const userSearchHistory = await SearchHistoryModel.find({
        userId: userId,
      })
        .skip((currentPage - 1) * pageSize)
        .sort(sortConfig)
        .limit(pageSize);

      return userSearchHistory;
    } catch (error) {
      this._logger.error(
        `Error occured while fetching user search history: ${error}`
      );
      throw error;
    }
  }

  public async createUserSearchHistory(userId: string, searchedUserId: string) {
    try {
      const searchHistory = await SearchHistoryModel.create({
        userId,
        searchedUserId,
      });

      return searchHistory;
    } catch (error) {
      this._logger.error(
        `Error occured while fetching user search history: ${error}`
      );
      throw error;
    }
  }
}
