import { Service } from 'typedi';
import { IMessageAttrs, IMessageDoc } from '../interfaces/IMessage';
import { Message } from '../models/Message.model';
import { logger } from '../loaders/logger';
import { SortOrder } from 'mongoose';

@Service()
export class MessageRepository {
  constructor() {}

  /**
   * Inserts many messages into the database.
   * @param {MessageAttrs[]} messages - An array of Message objects to be inserted.
   * @returns {Promise<MessageDoc[]>} A Promise that resolves to an array of inserted Message objects.
   */
  public async insertMany(messages: IMessageAttrs[]): Promise<IMessageDoc[]> {
    try {
      const savedMessages = await Message.insertMany(messages, {
        ordered: false,
      });
      return savedMessages as IMessageDoc[];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves messages from the database based on a given query.
   * @param {any} query - The MongoDB query object to filter the messages.
   * @param {string} [sort="messageId"] - The field used for sorting the messages (default: "messageId").
   * @param {string} [order="desc"] - The sort order ("asc" for ascending, "desc" for descending) (default: "desc").
   * @param {number} [limit=50] - The maximum number of messages to retrieve (default: 50).
   * @returns {Promise<MessageDoc[]>} A Promise that resolves to an array of Message objects.
   * @throws {Error} If there's an error during the message retrieval process.
   */
  public async find(
    query: any,
    sort = 'messageId',
    order = 'desc',
    limit = 50,
  ): Promise<IMessageDoc[]> {
    try {
      const sortConfig: { [key: string]: SortOrder } = {};
      sortConfig[sort] = order === 'asc' ? 1 : -1;

      const messages = await Message.find(query).sort(sortConfig).limit(limit).lean();
      return messages;
    } catch (error) {
      logger.error(`Error occured while fetching messages: ${error}`);
      throw error;
    }
  }
}
