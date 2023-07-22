import { Service } from "typedi";
import usersModel from "../models/users.model";
import { SortOrder, Types } from "mongoose";
import { logger } from "../loaders/logger";
import { UpdateUser, User } from "../interfaces/User";

@Service()
export class UserRepository {
  constructor() {}

  public async create(user: User) {
    try {
      const newUser = await usersModel.create(user);
      return newUser;
    } catch (error) {
      logger.error("Error occured while creating user");
      throw error;
    }
  }

  public async find(
    keyword: string,
    currentPage: number,
    itemsPerPage: number,
    sort: string,
    order: string
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;
      const regex = new RegExp("^" + keyword, "i");

      const users = await usersModel
        .find({
          $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { mobileNumber: { $regex: regex } },
            { email: { $regex: regex } },
          ],
        })
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort(sortConfig);

      return users;
    } catch (error) {
      logger.error(`Error occured while search user by ${keyword}`);
      throw error;
    }
  }

  public async findById(id: string) {
    try {
      const objectId = new Types.ObjectId(id);
      const user = await usersModel.findById(objectId);

      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id}`);
      throw error;
    }
  }

  public async update(id: string, user: UpdateUser) {
    try {
      const updatedUser = await usersModel.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        { $set: { ...user } }
      );
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id}`);
      throw error;
    }
  }
}
