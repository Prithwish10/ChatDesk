import { Service } from "typedi";
import { logger } from "../../loaders/logger";
import { MessageAttrs, MessageDoc } from "../../interfaces/v1/Message";
import { Message } from "../../models/v1/Message.model";
import { SortOrder } from "mongoose";

@Service()
export class MessageRepository {
  constructor() {}

  /**
   * Creates a new message.
   *
   * @param {MessageAttrs} message - The Message object containing the details of the message to be created.
   * @returns {Promise<MessageDoc>} A Promise that resolves to the newly created Message object.
   * @throws {Error} If there's an error during the message creation process.
   **/
  public async create(message: MessageAttrs): Promise<MessageDoc> {
    try {
      let newMessage = await Message.create(message);
      newMessage = await newMessage.populate({
        path: "sender_id",
        select: "firstName lastName email mobileNumber",
      });
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

  public async populateSenderIdInCreatedMessageParent(message: MessageDoc) {
    try {
      const populatedMessage = await message.populate(
        "parent_message_id.sender_id"
      );
      return populatedMessage;
    } catch (error) {
      logger.error(`Error occured while populating message: ${error}`);
      throw error;
    }
  }

  /**
   * Retrieves messages for a specific conversation.
   *
   * @param {string} conversation_id - The ID of the conversation for which messages are to be retrieved.
   * @param {string} [sort="createdAt"] - The field used for sorting the messages (default: "createdAt").
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
    sort = "createdAt",
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

      const messages = await Message.find(fetchMessageQuery)
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
   * @param {string} messageId - The ID of the message to be retrieved.
   * @returns {Promise<MessageDoc|null>} A Promise that resolves to the retrieved Message object, or null if not found.
   * @throws {Error} If there's an error during the message retrieval process.
   *
   */
  public async getById(messageId: string): Promise<MessageDoc | null> {
    try {
      const message = await Message.findOne({ _id: messageId, deleted: 0 });
      return message;
    } catch (error) {
      logger.error(`Error occured while getting message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Update Message
   *
   * This method updates a specific message identified by the given message ID with the provided Message object.
   * The message is updated based on the fields present in the provided message object.
   *
   * @param {MessageDoc} messageById - The message document to be updated.
   * @param {Message} message - The Message object containing the updated message details.
   * @returns {Promise<MessageDoc | null>} A Promise that resolves to the updated Message object after the update.
   * @throws {Error} If there's an error during the message update process.
   **/
  public async updateByMessageDoc(
    messageById: MessageDoc,
    message: MessageAttrs
  ): Promise<MessageDoc | null> {
    try {
      messageById.set(message);
      await messageById.save();

      return messageById;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Deletes a message (soft delete).
   *
   * @param {MessageDoc} messageById - The message document to be deleted.
   * @returns {Promise<MessageDoc>} A Promise that resolves to the updated Message object after the soft deletion.
   * @throws {Error} If there's an error during the message update process.
   */
  public async deleteByMessageDoc(
    messageById: MessageDoc
  ): Promise<MessageDoc> {
    try {
      messageById.set({ deleted: 1 });
      await messageById.save();

      return messageById;
    } catch (error) {
      logger.error(`Error occured while updating message by Id: ${error}`);
      throw error;
    }
  }

  /**
   * Count Documents
   *
   * This private method counts the number of documents in the Message collection that match the provided query.
   * It is used internally to determine the total count of messages for pagination purposes.
   *
   * @param {any} query - The query object to filter the documents for counting.
   * @returns {Promise<number>} A Promise that resolves to the total count of documents that match the query.
   * @throws {Error} If there's an error during the document counting process.
   */
  private async countDocuments(query: any): Promise<number> {
    try {
      const totalDocuments = await Message.countDocuments(query);
      return totalDocuments;
    } catch (error) {
      logger.error(`Error occured while counting documents: ${error}`);
      throw error;
    }
  }
}
