import { Service } from "typedi";
import { ConversationRepository } from "../repositories/Conversation.repository";

@Service()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository
  ) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
