import { Service } from 'typedi';
import { ConversationRepository } from '../repositories/Conversation.repository';
import { logger } from '../loaders/logger';

@Service()
export class ConversationService {
  constructor(private readonly _conversationRepository: ConversationRepository) {}

  /**
   * Retrieves user conversations based on the provided parameters.
   *
   * @param userId - The ID of the user for whom to fetch conversations.
   * @param sort - The field to sort conversations by.
   * @param order - The sort order ('asc' for ascending, 'desc' for descending).
   * @param limit - The maximum number of conversations to retrieve per page.
   * @param cursor - Optional: The timestamp of the last message in the previous page.
   * @param deleted - Optional: Indicates whether to include deleted conversations (0 for not deleted, 1 for deleted).
   * @returns An object containing the next cursor and an array of conversations.
   * @throws Throws an error if there was a problem retrieving the conversations.
   */
  public async getByUserId(
    userId: string,
    sort: string,
    order: string,
    limit: number,
    cursor: { timestamp: string; id: string },
    deleted: number,
  ) {
    try {
      const userConversations = await this._conversationRepository.getUserConversations(
        userId,
        sort,
        order,
        limit,
        deleted,
        cursor,
      );

      const lastConversation = userConversations[userConversations.length - 1];
      const nextCursor = lastConversation
        ? { timestamp: lastConversation[sort].toISOString(), id: lastConversation._id.toString() }
        : null;

      return {
        nextCursor: nextCursor ? nextCursor.toString() : null,
        conversations: userConversations,
      };
    } catch (error) {
      logger.error(`Error in service while fetching conversations: ${error}`);
      throw error;
    }
  }
}
