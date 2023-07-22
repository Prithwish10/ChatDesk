import { Service } from "typedi";
import { SortOrder, Types } from "mongoose";
import conversationModel from "../models/conversation.model";
import { logger } from "../loaders/logger";
import { Conversation } from "../interfaces/Conversation";

@Service()
export class ConversationRepository {
  constructor() {}

  public async create(conversation: Conversation) {
    try {
      const newConversation = await conversationModel.create(conversation);
      return newConversation;
    } catch (error) {
      logger.error("Error occured while creating conversation");
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
