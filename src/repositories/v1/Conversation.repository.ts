import { Inject, Service } from "typedi";
import { SortOrder } from "mongoose";
import { Conversation } from "../../interfaces/v1/Conversation";
import ConversationModel from "../../models/v1/Conversation.model";
import { Participant } from "../../interfaces/v1/Participant";
import Logger from "../../loaders/Logger";
import MessageModel from "../../models/v1/Message.model";
import UserModel from "../../models/v1/User.model";
import { Api404Error } from "../../utils/error-handlers/Api404Error";

@Service()
export class ConversationRepository {
  constructor(private readonly logger: Logger) {}

  /**
   * Creates a new conversation.
   *
   * @param conversation - The conversation object to create.
   * @returns A Promise that resolves to the created conversation.
   * @throws Throws an error if there was a problem creating the conversation.
   */
  public async create(conversation: Conversation) {
    try {
      const newConversation = await ConversationModel.create(conversation);
      return newConversation;
    } catch (error: any) {
      this.logger.error(`Error occured while creating conversation: ${error}`);
      throw error;
    }
  }

  public async get() {}

  /**
   * Retrieves a conversation by its ID.
   *
   * @param conversation_id - The ID of the conversation to fetch.
   * @returns A Promise that resolves to the conversation with the specified ID.
   * @throws Throws an error if there was a problem fetching the conversation.
   */
  public async getById(conversation_id: string) {
    try {
      const conversation = await ConversationModel.findById(conversation_id);

      return conversation;
    } catch (error) {
      this.logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Updates a conversation by its ID.
   *
   * @param conversation_id - The ID of the conversation to update.
   * @param conversation - The updated conversation object.
   * @returns A Promise that resolves to the updated conversation.
   * @throws Throws an error if there was a problem updating the conversation.
   */
  public async updateById(conversation_id: string, conversation: Conversation) {
    try {
      const updatedMessage = await ConversationModel.findByIdAndUpdate(
        { _id: conversation_id },
        conversation,
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a conversation by its ID (soft delete).
   *
   * @param conversation_id - The ID of the conversation to delete.
   * @returns A Promise that resolves to the deleted conversation.
   * @throws Throws an error if there was a problem deleting the conversation.
   */
  public async deleteById(conversation_id: string) {
    try {
      const updatedMessage = await ConversationModel.findByIdAndUpdate(
        { _id: conversation_id },
        { deleted: 1 }, // Soft delete
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Error occured while updating message by Id: ${error}`);
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
  ) {
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

      const existingConversation = await ConversationModel.findOne(query);

      return existingConversation;
    } catch (error: any) {
      this.logger.error(
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

      userConversations = await ConversationModel.find(participantQuery)
        .populate("participants")
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

      userConversations = await UserModel.populate(userConversations, {
        path: "participants.user_id",
        select: "username email",
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
          const unreadMessageCount = await MessageModel.countDocuments({
            conversation_id: userConversation._id,
            sender_id: { $ne: user_id },
            created_at: { $gt: lastCheckedTimestamp },
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
      this.logger.error(
        `Error occured while in repository while fetching user conversations: ${error}`
      );
      throw error;
    }
  }

  public async updateParticipantsLastCheckedTime(
    conversation_id: string,
    participant_id: string
  ) {
    try {
      const conversation = await this.getById(conversation_id);
      const participant = conversation?.participants.find(
        (participant) => participant.user_id.toString() === participant_id
      );
      if (!participant) {
        throw new Api404Error("Participant not found in the conversaation");
      }

      participant.last_checked_conversation_at = new Date();
      await conversation?.save();
    } catch (error) {
      this.logger.error(
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
      this.logger.error(
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
    conversation_id: string,
    participant_id: string
  ) {
    try {
      const updatedConversation = await ConversationModel.findByIdAndUpdate(
        conversation_id,
        {
          $pull: { participants: { user_id: participant_id } },
        },
        {
          new: true,
        }
      ).populate("participants");
      console.log(updatedConversation);

      return updatedConversation;
    } catch (error) {
      this.logger.error(
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
  private async countDocuments(query: any) {
    try {
      const totalDocuments = await ConversationModel.countDocuments(query);
      return totalDocuments;
    } catch (error) {
      this.logger.error(`Error occured while counting documents: ${error}`);
      throw error;
    }
  }
}
