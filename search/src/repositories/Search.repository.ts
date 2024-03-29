import { Service } from "typedi";
import { User } from "../models/users.model";
import { SortOrder, Types } from "mongoose";
import { Conversation } from "../models/conversation.model";
import { logger } from "../loaders/logger";
import { UserDoc } from "../interfaces/User";
import { ConversationDoc } from "../interfaces/Conversation";

@Service()
export class SearchRepository {
  constructor() {}

  public async findUsers(
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

      const users = await User.find({
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
  ): Promise<ConversationDoc[] | null> {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;
      const regex = new RegExp("^" + groupName, "i");

      const groups = await Conversation.find({
        $and: [
          { isGroup: true },
          { deleted: 0 },
          { "participants.user_id": new Types.ObjectId(currentUserId) },
          { group_name: { $regex: regex } },
        ],
      })
        .populate("participants.user_id")
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
