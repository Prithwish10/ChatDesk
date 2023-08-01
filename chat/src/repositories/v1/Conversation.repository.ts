import { Service } from "typedi";
import { SortOrder } from "mongoose";
import {
  ConversationAttrs,
  ConversationDoc,
} from "../../interfaces/v1/Conversation";
import { Conversation } from "../../models/v1/Conversation.model";
import { Participant } from "../../interfaces/v1/Participant";
import { logger } from "../../loaders/logger";
import { Message } from "../../models/v1/Message.model";
import { User } from "../../models/v1/User.model";
import { Api404Error } from "@pdchat/common";

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
    } catch (error: any) {
      logger.error(`Error occured while creating conversation: ${error}`);
      throw error;
    }
  }

  public async populateUserInParticipants(conversation: ConversationDoc) {
    try {
      const populatedConversation = await conversation.populate(
        "participants.user_id"
      );
      return populatedConversation;
    } catch (error) {
      logger.error(
        `Error occured while populating participants in conversation: ${error}`
      );
      throw error;
    }
  }

  public async getConversationByIdAlongWithUsers(
    conversationId: string
  ): Promise<ConversationDoc | null> {
    try {
      const conversation = await Conversation.findById(conversationId).populate(
        "participants.user_id"
      );

      return conversation;
    } catch (error) {
      logger.error(
        `Error occured while fedtching conversation by Id: ${error}`
      );
      throw error;
    }
  }

  public async getById(
    conversationId: string
  ): Promise<ConversationDoc | null> {
    try {
      const conversation = await Conversation.findById(conversationId);

      return conversation;
    } catch (error) {
      logger.error(
        `Error occured while fedtching conversation by Id: ${error}`
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
      logger.error(`Error occured while updating conversation: ${error}`);
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
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Checks if a conversation with the same participants exists.
   *
   * @param participants - An array of participant objects.
   * @param isGroup - A boolean field that tells whether it is a group or personal conversation.
   * @returns A Promise that resolves to the existing conversation if found, or null if not found.
   * @throws Throws an error if there was a problem checking the existence of the conversation.
   */
  public async isConversationWithSameParticipantsExists(
    participants: Participant[],
    isGroup: boolean
  ): Promise<ConversationDoc | null> {
    try {
      const participantQueries = participants.map((participant) => ({
        $elemMatch: {
          user_id: participant.user_id,
          role: participant.role,
        },
      }));

      const query = {
        $and: [
          { participants: { $size: participants.length } },
          { participants: { $all: participantQueries } },
          { isGroup: isGroup },
        ],
      };

      const existingConversation = await Conversation.findOne(query);

      return existingConversation;
    } catch (error: any) {
      logger.error(
        `Error occured while checking whether conversation with same participants exists: ${error}`
      );
      throw error;
    }
  }

  /**
   * Retrieves user conversations based on the provided parameters.
   *
   * @param user_id - The ID of the user for whom to retrieve conversations.
   * @param sort - The field to sort the conversations by (default: "last_message_timestamp").
   * @param order - The sort order ("asc" for ascending, "desc" for descending, default: "desc").
   * @param page - The page number of results to retrieve (default: 1).
   * @param limit - The maximum number of conversations to retrieve per page (default: 20).
   * @returns An object containing the total number of pages, total number of conversations,
   *          and an array of conversations with additional unread message count.
   * @throws Throws an error if there was a problem retrieving the conversations.
   */
  public async getUserConversations(
    user_id: string,
    sort = "last_message_timestamp",
    order = "desc",
    page = 1,
    limit = 20,
    deleted = 0
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;

      // Create the query to find conversations in which the user is a participant.
      const participantQuery = {
        participants: {
          $elemMatch: {
            user_id: user_id,
          },
        },
        deleted,
      };

      // Count the total number of conversations matching the participant query.
      const totalConversations = await this.countDocuments(participantQuery);
      const totalPages = Math.ceil(totalConversations / limit);
      const skip = (page - 1) * limit;

      let userConversations: any;

      userConversations = await Conversation.find(participantQuery)
        .populate("participants")
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

      userConversations = await User.populate(userConversations, {
        path: "participants.user_id",
        select: "firstName lastName email mobileNumber",
      });

      // Retrieve unread message counts for each conversation using MessageModel.
      const conversationsWithReadMessageCount = await Promise.all(
        userConversations.map(async (userConversation: any) => {
          // Retrieve the last checked timestamp for a specific user within a conversation
          const lastCheckedTimestamp = userConversation.participants.find(
            (participant: Participant) =>
              participant.user_id._id.toString() === user_id
          ).last_checked_conversation_at;

          // Count the number of unread messages in the conversation
          const unreadMessageCount = await Message.countDocuments({
            conversation_id: userConversation._id,
            sender_id: { $ne: user_id },
            createdAt: { $gt: lastCheckedTimestamp },
          });

          return {
            ...userConversation,
            unreadMessageCount,
          };
        })
      );

      return {
        totalPages,
        totalConversations,
        conversations: conversationsWithReadMessageCount,
      };
    } catch (error) {
      logger.error(
        `Error occured while in repository while fetching user conversations: ${error}`
      );
      throw error;
    }
  }

  public async updateParticipantsLastCheckedTimeByConversation(
    conversationById: ConversationDoc,
    participant_id: string
  ): Promise<ConversationDoc> {
    try {
      const participant = conversationById?.participants.find(
        (participant) => participant.user_id.toString() === participant_id
      );
      if (!participant) {
        throw new Api404Error("Participant not found in the conversaation");
      }

      participant.last_checked_conversation_at = new Date();
      await conversationById?.save();

      return conversationById;
    } catch (error) {
      logger.error(
        `Error occured while in repository while fetching user conversations: ${error}`
      );
      throw error;
    }
  }

  public async updateParticipantsLastCheckedTimeByConversationId(
    conversationId: string,
    participant_id: string
  ): Promise<void> {
    try {
      const conversation = await this.getById(conversationId);
      const participant = conversation?.participants.find(
        (participant) => participant.user_id.toString() === participant_id
      );
      if (!participant) {
        throw new Api404Error("Participant not found in the conversaation");
      }

      participant.last_checked_conversation_at = new Date();
      await conversation?.save();
    } catch (error) {
      logger.error(
        `Error occured while in repository while fetching user conversations: ${error}`
      );
      throw error;
    }
  }

  /**
   * Add a participant from a conversation.
   *
   * @param conversation_id - The ID of the conversation from which to remove the participant.
   * @param participant_id - The ID of the user who needs to be removed from the conversation.
   * @returns The conversation documents after adding the participant.
   * @throws Throws an error if there was a problem adding participant to the conversation.
   */
  public async addParticipantsToConversation(
    conversationById: ConversationDoc,
    participants: Participant[]
  ): Promise<ConversationDoc> {
    try {
      const existingParticipants = new Set(
        conversationById?.participants.map((existingParticipant) =>
          existingParticipant.user_id.id.toString()
        )
      );

      // Add new participants to the conversation if they don't already exist
      const newParticipants = participants.filter(
        (participant) =>
          !existingParticipants.has(participant.user_id.id.toString())
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

  /**
   * Remove a participant from a conversation.
   *
   * @param conversation_id - The ID of the conversation from which to remove the participant.
   * @param participant_id - The ID of the user who needs to be removed from the conversation.
   * @returns The conversation documents after removing the participant.
   * @throws Throws an error if there was a problem removing participant from the conversation.
   */
  public async removeParticipantFromConversation(
    conversationById: ConversationDoc,
    participant_id: string
  ): Promise<ConversationDoc> {
    try {
      conversationById.participants = conversationById.participants.filter(
        (participant) => participant.user_id.id.toString() !== participant_id
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

  /**
   * Counts the number of documents in a collection based on the provided query.
   *
   * @param query - The query object to filter the documents.
   * @returns The total number of documents that match the given query.
   * @throws Throws an error if there was a problem counting the documents.
   */
  private async countDocuments(query: any): Promise<number> {
    try {
      const totalDocuments = await Conversation.countDocuments(query);
      return totalDocuments;
    } catch (error) {
      logger.error(`Error occured while counting documents: ${error}`);
      throw error;
    }
  }

  public async getConversationByParticipant(
    conversationId: string,
    userId: string
  ): Promise<ConversationDoc | null> {
    try {
      const conversation = await Conversation.findOne({
        _id: conversationId,
        "participants.user_id": userId,
      });

      return conversation;
    } catch (error) {
      logger.error(
        `Error occured while fetching participant by user_id: ${error}`
      );
      throw error;
    }
  }
}
