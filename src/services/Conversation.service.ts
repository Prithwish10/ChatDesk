import { Service } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Conversation } from "../interfaces/v1/Conversation";
import { Api400Error } from "../utils/error-handlers/Api400Error";
import Logger from "../loaders/Logger";

@Service()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly logger: Logger
  ) {}

  /**
   * Creates a new conversation with the provided participants.
   *
   * @param conversation - The conversation object containing participants.
   * @returns The newly created conversation.
   * @throws Api400Error if a conversation with the same participants already exists.
   * @throws Error if an error occurs while creating the conversation.
   */
  public async create(conversation: Conversation) {
    try {
      const { participants } = conversation;

      // Check if a conversation with the same participants already exists
      const existingConversation =
        await this.conversationRepository.isConversationWithSameParticipantsExists(
          participants
        );
      if (existingConversation) {
        throw new Api400Error("Conversation already exist");
      }

      const newConversation = await this.conversationRepository.create(
        conversation
      );
      return newConversation;
    } catch (error: any) {
      this.logger.error(`Error in service while creating document: ${error}`);
      throw error;
    }
  }

  public async get() {
    console.log("hello");
  }

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
