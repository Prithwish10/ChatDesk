import { Service } from "typedi";
import { MessageRepository } from "../repositories/v1/Message.repository";
import { logger } from "../loaders/logger";
import config from "../config/config.global";
import { MessageAttrs } from "../interfaces/v1/Message";
import { Api400Error, Api404Error } from "@pdchat/common";
import Presence from "./Presence";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { MessageStatus } from "../enums/MessageStatus";

@Service()
export class MessageService {
  private readonly _presence: Presence;
  /**
   * This is a constructor function that takes in a message repository and a logger as parameters.
   * @param {MessageRepository} _messageRepository - It is a dependency injection of a
   * MessageRepository, which is a class that handles the storage and retrieval of
   * message data. The "private readonly" keywords indicate that this parameter is a class
   * property that cannot be modified outside of the constructor.
   */

  constructor(
    private readonly _messageRepository: MessageRepository,
    private readonly _conversationRepository: ConversationRepository
  ) {
    this._presence = Presence.getInstance(
      config.connections.redisOptions
    );
  }

  /**
   * Creates a new message.
   *
   * @param message - The message object to create.
   * @returns A Promise that resolves to the created message.
   * @throws Throws an error if there was a problem creating the message.
   */
  public async create(message: MessageAttrs) {
    try {
      const receivers =
        await this._conversationRepository.getConversationParticipants(
          message.conversation_id.toString()
        );

      if (!receivers) {
        throw new Api400Error(
          "The conversation doesnot have any participants."
        );
      }

      // let isAllParticipantsOnline = true;
      // for (let receiver = 1; receiver < receivers.length; receiver++) {
      //   if (
      //     receivers[receiver].user_id.toString() ===
      //     message.sender_id.toString()
      //   ) {
      //     continue;
      //   }

      //   let isUserOnline = this._presence.getByUserId(
      //     receivers[receiver].user_id.toString()
      //   );
      //   if (!isUserOnline) {
      //     isAllParticipantsOnline = false;
      //     break;
      //   }
      // }

      // message.status = isAllParticipantsOnline
      //   ? MessageStatus.Delivered
      //   : MessageStatus.Sent;

      const newMessage = await this._messageRepository.create(message);
      const messageWithPopulatedData =
        await this._messageRepository.populateSenderIdInCreatedMessageParent(
          newMessage
        );
      return messageWithPopulatedData;
    } catch (error) {
      logger.error(`Error in service while creating message: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves messages for a specific conversation.
   *
   * @param conversationId - The ID of the conversation to fetch messages for.
   * @returns A Promise that resolves to the messages for the specified conversation.
   * @throws Throws an error if there was a problem fetching the messages.
   */
  public async getMessagesForAConversation(
    conversationId: string,
    sort: string,
    order: string,
    page: number,
    limit: number,
    deleted: number
  ) {
    try {
      const messages =
        await this._messageRepository.getMessagesForAConversation(
          conversationId,
          sort,
          order,
          page,
          limit,
          deleted
        );
      return messages;
    } catch (error) {
      logger.error(`Error in service while fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves a message by its ID.
   *
   * @param messageId - The ID of the message to fetch.
   * @returns A Promise that resolves to the message with the specified ID.
   * @throws Throws a 404 error if the message does not exist.
   * @throws Throws an error if there was a problem fetching the message.
   */
  public async getById(messageId: string) {
    try {
      const message = await this._messageRepository.getById(messageId);
      if (!message) {
        throw new Api404Error("Message no longer exist!");
      }
      return message;
    } catch (error) {
      logger.error(`Error in service while fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Updates a message by its ID.
   *
   * @param messageId - The ID of the message to update.
   * @param message - The updated message object.
   * @returns A Promise that resolves to the updated message.
   * @throws Throws a 404 error if the message does not exist.
   * @throws Throws an error if there was a problem updating the message.
   */
  public async updateById(messageId: string, message: MessageAttrs) {
    try {
      const isMessagePresent = await this._messageRepository.getById(messageId);
      if (!isMessagePresent) {
        throw new Api404Error("Message no longer exist!");
      }
      const updatedMessage = await this._messageRepository.updateByMessageDoc(
        isMessagePresent,
        message
      );
      return updatedMessage;
    } catch (error) {
      logger.error(`Error in service while fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a message by its ID.
   *
   * @param messageId - The ID of the message to delete.
   * @throws Throws a 404 error if the message does not exist.
   * @throws Throws an error if there was a problem deleting the message.
   */
  public async deleteById(messageId: string) {
    try {
      const isMessagePresent = await this._messageRepository.getById(messageId);
      if (!isMessagePresent) {
        throw new Api404Error("Message no longer exist!");
      }
      await this._messageRepository.deleteByMessageDoc(isMessagePresent);
    } catch (error) {
      logger.error(`Error in service while fetching messages: ${error}`);
      throw error;
    }
  }
}
