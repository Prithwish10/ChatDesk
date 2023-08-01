import { Service } from "typedi";
import { SortOrder, Types } from "mongoose";
import { Conversation } from "../models/conversation.model";
import { logger } from "../loaders/logger";
import { ConversationAttrs, ConversationDoc } from "../interfaces/Conversation";
import { Participant } from "../interfaces/Participant";

@Service()
export class ConversationRepository {
  constructor() {}

  public async create(
    conversation: ConversationAttrs
  ): Promise<ConversationDoc> {
    try {
      const newConversation = Conversation.build(conversation);
      const savedConversation = await newConversation.save();
      return savedConversation;
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

  public async getById(
    conversationId: string
  ): Promise<ConversationDoc | null> {
    try {
      const conversation = await Conversation.findById(conversationId).populate(
        "participants"
      );

      return conversation;
    } catch (error) {
      logger.error(`Error occured while fetching conversation by Id: ${error}`);
      throw error;
    }
  }

  public async findByIdAndPreviousVersion(id: string, version: number) {
    try {
      const user = await Conversation.findByEvent({ id, version });

      return user;
    } catch (error) {
      logger.error(
        `Error occured while fetching conversation by Id: ${id} and version: ${version}`
      );
      throw error;
    }
  }

  public async updateByConversation(
    conversationById: ConversationDoc,
    conversation: Partial<ConversationAttrs>
  ): Promise<ConversationDoc> {
    try {
      conversationById.set(conversation);
      await conversationById.save();

      return conversationById;
    } catch (error) {
      logger.error(`Error occured while updating conversation by Id: ${error}`);
      throw error;
    }
  }

  public async deleteByConversation(
    conversationById: ConversationDoc
  ): Promise<ConversationDoc> {
    try {
      conversationById.set({ deleted: 1 });
      await conversationById.save();

      return conversationById;
    } catch (error) {
      logger.error(`Error occured while updating conversation by Id: ${error}`);
      throw error;
    }
  }

  public async addParticipantsToConversation(
    conversationById: ConversationDoc,
    participants: Participant[]
  ): Promise<ConversationDoc> {
    try {
      const existingParticipants = new Set(
        conversationById.participants.map((existingParticipant) =>
          existingParticipant.user_id.toString()
        )
      );

      // Add new participants to the conversation if they don't already exist
      const newParticipants = participants.filter(
        (participant) =>
          !existingParticipants.has(participant.user_id.toString())
      );

      conversationById.participants.push(...newParticipants);

      // Save the updated conversation
      await conversationById.save();

      return conversationById;
    } catch (error) {
      logger.error(
        `Error occured while in repository while adding participants conversations: ${error}`
      );
      throw error;
    }
  }

  public async removeParticipantFromConversation(
    conversationById: ConversationDoc,
    participant_id: string
  ): Promise<ConversationDoc> {
    try {
      conversationById.participants = conversationById.participants.filter(
        (participant) => participant.user_id.toString() !== participant_id
      );

      // Save the updated conversation
      await conversationById.save();

      return conversationById;
    } catch (error) {
      logger.error(
        `Error occured while in repository while removing participants conversations: ${error}`
      );
      throw error;
    }
  }
}
