import { Service } from "typedi";
import Logger from "../../loaders/Logger";
import { Message } from "../../interfaces/v1/Message";
import MessageModel from "../../models/v1/Message.model";
import { Types } from "mongoose";
import { Api404Error } from "../../utils/error-handlers/Api404Error";

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
      if (message.parent_message_id) {
        message.parent_message_id = new Types.ObjectId(
          message.parent_message_id
        );
      }
      const newMessage = await MessageModel.create(message);
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
  public async getMessagesForAConversation(conversation_id: string) {
    try {
      // const messages = await MessageModel.find({conversation_id: conversation_id}).populate('parent_message_id').exec();
      const messages = await MessageModel.aggregate([
        {
          $match: {
            conversation_id: conversation_id,
            deleted: 0,
            thread_id: null,
          },
        },
        {
          $lookup: {
            from: "Message",
            localField: "_id",
            foreignField: "parent_message_id",
            as: "threads",
          },
        },
      ]).exec();
      return messages;
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
}
