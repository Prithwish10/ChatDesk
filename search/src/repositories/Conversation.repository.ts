import { Service } from "typedi";
import { SortOrder, Types } from "mongoose";
import conversationModel from "../models/conversation.model";
import { logger } from "../loaders/logger";
import { Conversation } from "../interfaces/Conversation";
import { Participant } from "../interfaces/Participant";

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

  public async getById(conversation_id: string) {
    try {
      const conversation = await conversationModel.findById(conversation_id);

      return conversation;
    } catch (error) {
      logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

  public async updateById(conversation_id: string, conversation: Conversation) {
    try {
      const updatedMessage = await conversationModel.findByIdAndUpdate(
        { _id: conversation_id },
        conversation,
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  public async deleteById(conversation_id: string) {
    try {
      const updatedMessage = await conversationModel.findByIdAndUpdate(
        { _id: conversation_id },
        { deleted: 1 }, // Soft delete
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  public async addParticipantsToConversation(
    conversation_id: string,
    participants: Participant[]
  ) {
    try {
      const conversation = await this.getById(conversation_id);

      const existingParticipants = new Set(
        conversation?.participants.map((existingParticipant) =>
          existingParticipant.user_id.toString()
        )
      );

      // Add new participants to the conversation if they don't already exist
      const newParticipants = participants.filter(
        (participant) =>
          !existingParticipants.has(participant.user_id.toString())
      );

      conversation?.participants.push(...newParticipants);

      // Save the updated conversation
      const updatedConversation = await conversation?.save();

      return updatedConversation;
    } catch (error) {
      logger.error(
        `Error occured while in repository while adding participants conversations: ${error}`
      );
      throw error;
    }
  }

  public async removeParticipantFromConversation(
    conversation_id: string,
    participant_id: string
  ) {
    try {
      const updatedConversation = await conversationModel
        .findByIdAndUpdate(
          conversation_id,
          {
            $pull: { participants: { user_id: participant_id } },
          },
          {
            new: true,
          }
        )
        .populate("participants");

      return updatedConversation;
    } catch (error) {
      logger.error(
        `Error occured while in repository while removing participants conversations: ${error}`
      );
      throw error;
    }
  }
}
