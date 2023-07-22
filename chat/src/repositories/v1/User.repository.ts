import { Service } from "typedi";
import usersModel from "../../models/v1/User.model";
import { SortOrder, Types } from "mongoose";
import { logger } from "../../loaders/logger";
import { UpdateUser, User } from "../../interfaces/v1/User";

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
