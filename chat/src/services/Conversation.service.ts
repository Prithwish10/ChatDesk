import { Service } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Conversation } from "../interfaces/v1/Conversation";
import { Api400Error, Api401Error, Api404Error } from "@pdchat/common";
import { logger } from "../loaders/logger";
import { Participant } from "../interfaces/v1/Participant";

@Service()
export class ConversationService {
  /**
   * This is a constructor function that takes in a ConversationRepository and a Logger as parameters
   * and assigns them to private readonly properties.
   * @param {ConversationRepository} _conversationRepository - It is a dependency injection of a
   * ConversationRepository, which is a class that handles the storage and retrieval of
   * conversation data. The "private readonly" keywords indicate that this parameter is a class
   * property that cannot be modified outside of the constructor.
   */
  constructor(
    private readonly _conversationRepository: ConversationRepository
  ) {}

  /**
   * Creates a new conversation with the provided participants.
   *
   * @param conversation - The conversation object containing participants.
   * @returns The newly created/previous conversation.
   * @throws Error if an error occurs while creating the conversation.
   */
  public async create(conversation: Conversation) {
    try {
      const { isGroup, participants } = conversation;

      if (!isGroup && participants.length > 2) {
        throw new Api400Error(
          `Personal conversation can not have more than 2 participants.`
        );
      }

      if (participants.length < 2) {
        throw new Api400Error(
          `More than 2 participants are required to create a conversation.`
        );
      }

      // Check if a conversation with the same participants already exists
      const existingConversation =
        await this._conversationRepository.isConversationWithSameParticipantsExists(
          participants,
          isGroup
        );
      if (existingConversation) {
        // throw new Api400Error("Conversation already exist");
        return { conversation: existingConversation, isNew: false };
      }

      const newConversation = await this._conversationRepository.create(
        conversation
      );

      return { conversation: newConversation, isNew: true };
    } catch (error: any) {
      logger.error(`Error in service while creating document: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves user conversations based on the provided parameters.
   *
   * @param user_id - The ID of the user for whom to fetch conversations.
   * @param sort - The field to sort conversations by.
   * @param order - The sort order ('asc' for ascending, 'desc' for descending).
   * @param page - The page number of the conversations to retrieve.
   * @param limit - The maximum number of conversations to retrieve per page.
   * @param deleted - Optional: Indicates whether to include deleted conversations (0 for not deleted, 1 for deleted).
   * @returns A Promise that resolves to the user conversations matching the parameters.
   * @throws Throws an error if there was a problem retrieving user conversations.
   */
  public async getUserConversations(
    user_id: string,
    sort: string,
    order: string,
    page: number,
    limit: number,
    deleted: number = 0
  ) {
    try {
      const totalUserConversations =
        await this._conversationRepository.getUserConversations(
          user_id,
          sort,
          order,
          page,
          limit,
          deleted
        );

      return totalUserConversations;
    } catch (error) {
      logger.error(
        `Error in service while creating conversation: ${error}`
      );
      throw error;
    }
  }

  /**
   * Retrieves a conversation by its ID.
   *
   * @param conversation_id - The ID of the conversation to fetch.
   * @returns A Promise that resolves to the conversation with the specified ID.
   * @throws Throws a 404 error if the conversation does not exist.
   * @throws Throws an error if there was a problem fetching the conversation.
   */
  public async getById(conversation_id: string) {
    try {
      const conversation = await this._conversationRepository.getById(
        conversation_id
      );
      if (!conversation || conversation.deleted === 1) {
        throw new Api404Error("Conversation no longer exist!");
      }

      return conversation;
    } catch (error) {
      logger.error(
        `Error in service while fetching conversation by Id: ${error}`
      );
      throw error;
    }
  }

  /**
   * Updates a conversation by its ID.
   *
   * @param conversation_id - The ID of the conversation to update.
   * @param conversation - The updated conversation object.
   * @returns A Promise that resolves to the updated conversation.
   * @throws Throws a 404 error if the conversation does not exist.
   * @throws Throws an error if there was a problem updating the conversation.
   */
  public async updateById(conversation_id: string, conversation: Conversation) {
    try {
      const isConversationPresent = await this._conversationRepository.getById(
        conversation_id
      );
      if (!isConversationPresent || isConversationPresent.deleted === 1) {
        throw new Api404Error("Conversation no longer exist!");
      }
      const updatedConversation = await this._conversationRepository.updateById(
        conversation_id,
        conversation
      );

      return updatedConversation;
    } catch (error) {
      logger.error(
        `Error in service while updating conversation: ${error}`
      );
      throw error;
    }
  }

  /**
   * Deletes a conversation by its ID.
   *
   * @param conversation_id - The ID of the conversation to delete.
   * @throws Throws a 404 error if the conversation does not exist.
   * @throws Throws an error if there was a problem deleting the conversation.
   */
  public async deleteById(conversation_id: string): Promise<void> {
    try {
      const isConversationPresent = await this._conversationRepository.getById(
        conversation_id
      );
      if (!isConversationPresent || isConversationPresent.deleted === 1) {
        throw new Api404Error("Conversation no longer exist!");
      }

      await this._conversationRepository.deleteById(conversation_id);
    } catch (error) {
      logger.error(
        `Error in service while soft deleting conversation: ${error}`
      );
      throw error;
    }
  }

  /**
   * Adds participants to a conversation.
   *
   * @param conversation_id - The ID of the conversation.
   * @param participants - An array of Participant objects to be added.
   * @returns The conversation object with updated participants.
   * @throws Api404Error if the conversation doesn't exist or is deleted.
   * @throws Error if an error occurs while adding participants to the conversation.
   */
  public async addParticipantsToConversation(
    conversation_id: string,
    participants: Participant[],
    currentUser_id: string
  ) {
    try {
      const isConversationPresent = await this._conversationRepository.getById(
        conversation_id
      );
      if (!isConversationPresent || isConversationPresent.deleted === 1) {
        throw new Api404Error("Conversation no longer exist!");
      }

      const user = isConversationPresent.participants.find((participant) => {
        return participant.user_id.toString() === currentUser_id;
      });

      if (!user || (user && !user.isAdmin)) {
        throw new Api401Error("You are not an admin.");
      }

      const conversationWithUpdatedParticipants =
        await this._conversationRepository.addParticipantsToConversation(
          conversation_id,
          participants
        );

      return conversationWithUpdatedParticipants;
    } catch (error) {
      logger.error(
        `Error in service while adding participants to a conversation: ${error}`
      );
      throw error;
    }
  }

  /**
   * Removes a participant from a conversation.
   *
   * @param conversation_id - The ID of the conversation.
   * @param participant_id - The ID of the participant to be removed.
   * @returns The conversation object with updated participants.
   * @throws Api404Error if the conversation doesn't exist or is deleted.
   * @throws Error if an error occurs while removing the participant from the conversation.
   */
  public async removeParticipantsToConversation(
    conversation_id: string,
    participant_id: string,
    currentUser_id: string
  ) {
    try {
      const isConversationPresent = await this._conversationRepository.getById(
        conversation_id
      );
      if (!isConversationPresent || isConversationPresent.deleted === 1) {
        throw new Api404Error("Conversation no longer exist!");
      }

      const user = isConversationPresent.participants.find((participant) => {
        return participant.user_id.toString() === currentUser_id;
      });

      if (!user || (user && !user.isAdmin)) {
        throw new Api401Error("You are not an admin.");
      }

      const conversationWithUpdatedParticipants =
        await this._conversationRepository.removeParticipantFromConversation(
          conversation_id,
          participant_id
        );

      return conversationWithUpdatedParticipants;
    } catch (error) {
      logger.error(
        `Error in service while removing participants from a conversation: ${error}`
      );
      throw error;
    }
  }
}
