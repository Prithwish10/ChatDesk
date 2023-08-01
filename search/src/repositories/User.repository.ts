import { Service } from "typedi";
import { User } from "../models/users.model";
import { SortOrder, Types } from "mongoose";
import { logger } from "../loaders/logger";
import { UserAttrs, UserDoc } from "../interfaces/User";

@Service()
export class UserRepository {
  constructor() {}

  public async create(user: any): Promise<UserDoc> {
    try {
      const newUser = User.build(user);
      let savedUser = await newUser.save();
      return savedUser;
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
  ): Promise<UserDoc[] | null> {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;
      const regex = new RegExp("^" + keyword, "i");

      const users = await User
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

  public async findById(id: string): Promise<UserDoc | null> {
    try {
      const user = await User.findById(id);

      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id}`);
      throw error;
    }
  }

  public async update(id: string, fetchedUserById: UserDoc, user: Partial<UserAttrs>): Promise<void> {
    try {
      const updatedUser = fetchedUserById.set(user);
      await updatedUser.save();
    } catch (error) {
      logger.error(`Error occured while fetching user by Id: ${id}`);
      throw error;
    }
  }
}
