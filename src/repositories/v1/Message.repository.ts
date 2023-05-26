import { Service } from "typedi";
import Logger from "../../loaders/Logger";
import { Message } from "../../interfaces/v1/Message";
import MessageModel from "../../models/v1/Message.model";
import { Types } from "mongoose";
import { Api404Error } from "../../utils/error-handlers/Api404Error";

@Service()
export class MessageRepository {
  constructor(private readonly logger: Logger) {}

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

  public async getById(message_id: string) {
    try {
      const message = await MessageModel.find({ _id: message_id, deleted: 0 });
      return message;
    } catch (error) {
      this.logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

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
