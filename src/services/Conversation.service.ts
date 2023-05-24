import { Inject, Service } from "typedi";
import { ConversationRepository } from "../repositories/v1/Conversation.repository";
import { Conversation } from "../interfaces/v1/Conversation";
import { Api500Error } from "../utils/error-handlers/Api500Error";
import { Api400Error } from "../utils/error-handlers/Api400Error";
import Logger from "../loaders/Logger";

@Service()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly logger: Logger
  ) {}

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
      throw new Api500Error(error.message);
    }
  }

  public async get() {
    console.log("hello");
  }

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
