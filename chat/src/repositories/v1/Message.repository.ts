import { Service } from "typedi";
import { logger } from "../../loaders/logger";
import { Message } from "../../interfaces/v1/Message";
import MessageModel from "../../models/v1/Message.model";
import { SortOrder } from "mongoose";

@Service()
export class MessageRepository {
  constructor() {}

  /**
   * Creates a new message.
   *
   * @param {Message} message - The Message object containing the details of the message to be created.
   * @returns {Promise<Message>} A Promise that resolves to the newly created Message object.
   * @throws {Error} If there's an error during the message creation process.
   **/
  public async create(message: Message): Promise<Message> {
    try {
      let newMessage = await MessageModel.create(message);
      newMessage = await newMessage.populate({
        path: "sender_id",
        select: "firstName lastName email mobileNumber"
      })
       newMessage = await newMessage.populate({
         path: "parent_message_id",
         select: "sender_id content attachments",
       });

      return newMessage;
    } catch (error) {
      logger.error(`Error occured while creating message: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves messages for a specific conversation.
   *
   * @param {string} conversation_id - The ID of the conversation for which messages are to be retrieved.
   * @param {string} [sort="created_at"] - The field used for sorting the messages (default: "created_at").
   * @param {string} [order="desc"] - The sort order ("asc" for ascending, "desc" for descending) (default: "desc").
   * @param {number} [page=1] - The page number for pagination (default: 1).
   * @param {number} [limit=20] - The maximum number of messages to retrieve per page (default: 20).
   * @param {number} [deleted=0] - Filter deleted messages (0 for false, 1 for true) (default: 0).
   * @returns {Promise<Object>} A Promise that resolves to an object containing the messages for the conversation,
   *                            along with pagination details (totalPages, currentPage, totalMessages).
   * @throws {Error} If there's an error during the message retrieval process.
   *
   */
  public async getMessagesForAConversation(
    conversation_id: string,
    sort = "created_at",
    order = "desc",
    page = 1,
    limit = 40,
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
        .populate({
          path: "sender_id",
          select: "firstName lastName email mobileNumber",
        })
        .populate({
          path: "parent_message_id",
          select: "sender_id content attachments",
          populate: {
            path: "sender_id",
            select: "firstName lastName email mobileNumber",
          },
        })
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
      logger.error(`Error occured while fetching messages: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves a message by its ID.
   *
   * @param {string} message_id - The ID of the message to be retrieved.
   * @returns {Promise<Message|null>} A Promise that resolves to the retrieved Message object, or null if not found.
   * @throws {Error} If there's an error during the message retrieval process.
   *
   */
  public async getById(message_id: string) {
    try {
      const message = await MessageModel.find({ _id: message_id, deleted: 0 });
      return message;
    } catch (error) {
      logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Update Message by ID
   *
   * This method updates a specific message identified by the given message ID with the provided Message object.
   * The message is updated based on the fields present in the provided message object.
   *
   * @param {string} message_id - The ID of the message to be updated.
   * @param {Message} message - The Message object containing the updated message details.
   * @returns {Promise<Message>} A Promise that resolves to the updated Message object after the update.
   * @throws {Error} If there's an error during the message update process.
   **/
  public async updateById(
    message_id: string,
    message: Message
  ): Promise<Message | null> {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        { _id: message_id },
        { $set: message },
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a message by its ID (soft delete).
   *
   * @param {string} message_id - The ID of the message to be deleted.
   * @returns {Promise<Message | null>} A Promise that resolves to the updated Message object after the soft deletion.
   * @throws {Error} If there's an error during the message update process.
   */
  public async deleteById(message_id: string): Promise<Message | null> {
    try {
      const updatedMessage = await MessageModel.findByIdAndUpdate(
        { _id: message_id },
        { deleted: 1 }, // Soft delete
        { new: true }
      );
      return updatedMessage;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Count Documents
   *
   * This private method counts the number of documents in the MessageModel collection that match the provided query.
   * It is used internally to determine the total count of messages for pagination purposes.
   *
   * @param {any} query - The query object to filter the documents for counting.
   * @returns {Promise<number>} A Promise that resolves to the total count of documents that match the query.
   * @throws {Error} If there's an error during the document counting process.
   */
  private async countDocuments(query: any): Promise<number> {
    try {
      const totalDocuments = await MessageModel.countDocuments(query);
      return totalDocuments;
    } catch (error) {
      logger.error(`Error occured while counting documents: ${error}`);
      throw error;
    }
  }
}
