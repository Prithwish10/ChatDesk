import { Service } from 'typedi';
import { MongooseBulkWriteOptions, SortOrder, Types } from 'mongoose';
import { IConversationAttrs, IConversationDoc } from '../interfaces/IConversation';
import { Conversation } from '../models/Conversation.model';
import { IParticipant } from '../interfaces/IParticipant';
import { logger } from '../loaders/logger';
import { User } from '../models/User.model';
import { Api404Error } from '@pdchat/common';

@Service()
export class ConversationRepository {
  constructor() {}

  /**
   * Creates a new conversation.
   * @param conversation - The conversation to create.
   * @returns The created conversation.
   * @throws Api404Error - If the conversation could not be created.
   */
  public async create(
    conversation: IConversationAttrs & { _id?: string | Types.ObjectId; version?: number },
  ): Promise<IConversationDoc> {
    try {
      const newConversation = Conversation.build(conversation);
      const savedConversation = await newConversation.save();

      return savedConversation;
    } catch (error: any) {
      logger.error(`Error occured while creating conversation: ${error}`);
      throw error;
    }
  }

  /**
   * Executes a bulk write operation on the Conversation model.
   * @param operation - The bulk write operations to perform.
   * @param option - The bulk write options.
   * @returns A promise that resolves when the bulk write operation is complete.
   * @throws error - If the bulk write operation fails.
   */
  public async bulkWrite(operation: any[], option: MongooseBulkWriteOptions) {
    try {
      await Conversation.bulkWrite(operation, option);
      logger.info(`✅ Bulk updated ${operation.length} conversations.`);
    } catch (error) {
      logger.error(`❌ Bulk write error: ${error}`);
      throw error;
    }
  }

  public async findByIdAndPreviousVersion(
    id: string,
    version: number,
  ): Promise<IConversationDoc | null> {
    try {
      const conversation = await Conversation.findOne({ _id: id, version });

      return conversation;
    } catch (error) {
      logger.error(
        `Error occured while fetching conversation by Id: ${id} and version: ${version}`,
      );
      throw error;
    }
  }

  public async populateUserInParticipants(conversation: IConversationDoc) {
    try {
      const populatedConversation = await conversation.populate('participants.userId');
      return populatedConversation;
    } catch (error) {
      logger.error(`❌ Error occured while populating participants in conversation: ${error}`);
      throw error;
    }
  }

  public async getConversationByIdAlongWithUsers(
    conversationId: string,
  ): Promise<IConversationDoc | null> {
    try {
      const conversation =
        await Conversation.findById(conversationId).populate('participants.userId');

      return conversation;
    } catch (error) {
      logger.error(`Error occured while fedtching conversation by Id: ${error}`);
      throw error;
    }
  }

  public async getById(conversationId: string): Promise<IConversationDoc | null> {
    try {
      const conversation = await Conversation.findById(conversationId);

      return conversation;
    } catch (error) {
      logger.error(`Error occured while fedtching conversation by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Updates a conversation by its ID.
   *
   * @param conversationId - The ID of the conversation to update.
   * @param conversation - The updated conversation object.
   * @returns The updated conversation document.
   * @throws Throws an error if there's a problem updating the conversation.
   */
  public async updateConversation(
    conversationId: string,
    conversation: Partial<IConversationAttrs>,
    version?: number,
  ): Promise<IConversationDoc | null> {
    try {
      const result = await Conversation.findOneAndUpdate(
        { _id: conversationId },
        { $set: conversation },
        { returnDocument: 'after' },
      );

      return result;
    } catch (error) {
      logger.error(`Error occured while updating conversation: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a conversation for a specific user.
   * @param conversationId - The ID of the conversation to delete.
   * @param deletedFor - The ID of the user for whom the conversation is to be deleted.
   * @returns The updated conversation document.
   * @throws Throws an error if there's a problem deleting the conversation.
   */
  public async deleteUserConversation(
    conversationId: string,
    deletedFor: string,
    version?: number,
  ): Promise<IConversationDoc | null> {
    try {
      const result = await Conversation.findOneAndUpdate(
        { '_id': conversationId, 'participants.userId': deletedFor },
        { $set: { 'participants.$.isConversationDeleted': true } },
        { returnDocument: 'after' },
      );

      return result;
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
    participants: IParticipant[],
    isGroup: boolean,
  ): Promise<IConversationDoc | null> {
    try {
      const participantQueries = participants.map((participant) => ({
        $elemMatch: {
          user_id: participant.userId,
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
        `Error occured while checking whether conversation with same participants exists: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Retrieves user conversations based on the provided parameters.
   *
   * @param userId - The ID of the user for whom to retrieve conversations.
   * @param sort - The field to sort conversations by (default: "lastMessageTimestamp").
   * @param order - The sort order ("asc" for ascending, "desc" for descending, default: "desc").
   * @param page - The page number of results to retrieve (default: 1).
   * @param limit - The maximum number of conversations to retrieve per page (default: 20).
   * @param deleted - Optional: Indicates whether to include deleted conversations (0 for not deleted, 1 for deleted).
   **/
  public async getUserConversations(
    userId: string,
    sort: string = 'lastMessageTimestamp',
    order: string = 'desc',
    limit: number = 20,
    deleted: number = 0,
    cursor?: { timestamp: string; id: string },
  ) {
    try {
      const sortOrder: SortOrder = order === 'asc' ? 1 : -1;
      const query: any = {
        participants: { $elemMatch: { userId } },
        deleted,
      };

      // Apply cursor-based pagination with composite cursor (timestamp + _id)
      if (cursor) {
        query.$or = [
          {
            [sort]: { [sortOrder === 1 ? '$gt' : '$lt']: new Date(cursor.timestamp) }, // Primary filter
          },
          {
            [sort]: new Date(cursor.timestamp), // If timestamp is the same, resolve using _id
            _id: { [sortOrder === 1 ? '$gt' : '$lt']: cursor.id },
          },
        ];
      }

      let userConversations: any;
      userConversations = await Conversation.find(query)
        .populate('participants')
        .sort({ [sort]: sortOrder, _id: sortOrder })
        .limit(limit)
        .lean();

      userConversations = await User.populate(userConversations, {
        path: 'participants.user_id',
        select: 'firstName lastName email mobileNumber',
      });

      return userConversations;
    } catch (error) {
      logger.error(`Error occured while in repository while fetching user conversations: ${error}`);
      throw error;
    }
  }

  /**
   * Adds participants to an existing conversation.
   *
   * @param conversationId - The ID of the conversation to which participants are to be added.
   * @param participants - An array of participant objects to be added to the conversation.
   * @returns A promise that resolves to the updated conversation document.
   * @throws Api404Error if the conversation is not found.
   * @throws Error if an error occurs while updating the conversation.
   */

  public async addParticipantsToConversation(
    conversationId: string,
    participants: IParticipant[],
    version?: number
  ): Promise<IConversationDoc> {
    try {
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $addToSet: { participants: { $each: participants } } },
        { new: true },
      );

      if (!updatedConversation) {
        throw new Api404Error('Conversation not found');
      }

      return updatedConversation;
    } catch (error) {
      logger.error(
        `Error occured while in repository while adding participants conversations: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Removes a participant from a conversation.
   *
   * @param conversationId - The ID of the conversation from which to remove the participant.
   * @param participantId - The ID of the user who needs to be removed from the conversation.
   * @returns A promise that resolves to the updated conversation document.
   * @throws Api404Error if the conversation is not found.
   * @throws Error if an error occurs while updating the conversation.
   */
  public async removeParticipantFromConversation(
    conversationId: string,
    participantId: string,
    version?: number
  ): Promise<IConversationDoc> {
    try {
      const updatedConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { $pull: { participants: { userId: participantId } } },
        { new: true },
      );

      if (!updatedConversation) {
        throw new Api404Error('Conversation not found');
      }

      return updatedConversation;
    } catch (error) {
      logger.error(
        `Error occured while in repository while removing participants conversations: ${error}`,
      );
      throw error;
    }
  }

  public async getConversationByParticipant(
    conversationId: string,
    userId: string,
  ): Promise<IConversationDoc | null> {
    try {
      const conversation = await Conversation.findOne({
        '_id': conversationId,
        'participants.user_id': userId,
      });

      return conversation;
    } catch (error) {
      logger.error(`Error occured while fetching participant by user_id: ${error}`);
      throw error;
    }
  }

  public async getConversationParticipants(conversationId: string) {
    try {
      const participants = await Conversation.findById({ conversationId }, { participants: 1 });

      return participants?.participants;
    } catch (error) {
      logger.error(`Error occured while fetching participants from conversation: ${error}`);
      throw error;
    }
  }
}
