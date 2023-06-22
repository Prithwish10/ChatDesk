import { Service } from "typedi";
import Logger from "../../loaders/Logger";
import { Message } from "../../interfaces/v1/Message";
import MessageModel from "../../models/v1/Message.model";
import UserModel from "../../models/v1/User.model";
import { SortOrder } from "mongoose";

@Service()
export class MessageRepository {
  constructor(private readonly logger: Logger) {}

  /**
   * Creates a new message.
   *
   * @param message - The message object to create.
   * @returns A Promise that resolves to the created message.
   * @throws Throws an error if there was a problem creating the message.
   */
  public async create(message: Message) {
    try {
      let newMessage = await MessageModel.create(message);
      newMessage = await newMessage.populate("sender_id", "username email");

      return newMessage;
    } catch (error) {
      this.logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves messages for a specific conversation.
   *
   * @param conversation_id - The ID of the conversation to fetch messages for.
   * @returns A Promise that resolves to the messages for the specified conversation.
   * @throws Throws an error if there was a problem fetching the messages.
   */
  public async getMessagesForAConversation(
    conversation_id: string,
    sort = "created_at",
    order = "desc",
    page = 1,
    limit = 20,
    deleted = 0
  ) {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === "asc" ? 1 : -1;

      const fetchMessageQuery = {
        conversation_id: conversation_id,
        deleted,
      };

      const totalMessages = await this.countDocuments(fetchMessageQuery);
      const totalPages = Math.ceil(totalMessages / limit);
      const skip = (page - 1) * limit;

      const messages = await MessageModel.find(fetchMessageQuery)
        .populate("sender_id", "username email")
        .sort(sortConfig)
        .skip(skip)
        .limit(limit)
        .lean();

      return {
        totalPages,
        currentPage: page,
        totalMessages,
        messages,
      };
    } catch (error) {
      this.logger.error(`Error occured while fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves a message by its ID.
   *
   * @param message_id - The ID of the message to fetch.
   * @returns A Promise that resolves to the message with the specified ID.
   * @throws Throws an error if there was a problem fetching the message.
   */
  public async getById(message_id: string) {
    try {
      const message = await MessageModel.find({ _id: message_id, deleted: 0 });
      return message;
    } catch (error) {
      this.logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Updates a message by its ID.
   *
   * @param message_id - The ID of the message to update.
   * @param message - The updated message object.
   * @returns A Promise that resolves to the updated message.
   * @throws Throws an error if there was a problem updating the message.
   */
  public async updateById(message_id: string, message: Message) {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        { _id: message_id },
        message,
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a message by its ID (soft delete).
   *
   * @param message_id - The ID of the message to delete.
   * @returns A Promise that resolves to the deleted message.
   * @throws Throws an error if there was a problem deleting the message.
   */
  public async deleteById(message_id: string) {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        { _id: message_id },
        { deleted: 1 }, // Soft delete
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      this.logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  private async countDocuments(query: any) {
    try {
      const totalDocuments = await MessageModel.countDocuments(query);
      return totalDocuments;
    } catch (error) {
      this.logger.error(`Error occured while counting documents: ${error}`);
      throw error;
    }
  }
}
