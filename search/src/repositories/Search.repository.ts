import { Service } from "typedi";
import usersModel from "../models/users.model";
import { SortOrder, Types } from "mongoose";
import conversationModel from "../models/conversation.model";
import { logger } from "../loaders/logger";

@Service()
export class SearchRepository {
  constructor() {}

  public async findUsers(
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

  public async findGroups(
    groupName: string,
    currentUserId: string,
    currentPage: number,
    itemsPerPage: number,
    sort: string,
    order: string
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;
      const regex = new RegExp("^" + groupName, "i");

      const groups = await conversationModel
        .find({
          $and: [
            { isGroup: true },
            { "participants.user_id": new Types.ObjectId(currentUserId) },
            { group_name: { $regex: regex } },
          ],
        })
        .skip((currentPage - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .sort(sortConfig);

      return groups;
    } catch (error) {
      logger.error(
        `Error occured while search groups by group_name: ${groupName}`
      );
      throw error;
    }
  }
}
