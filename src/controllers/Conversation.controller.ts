import { Service } from "typedi";
import { ConversationService } from "../services/Conversation.service";

@Service()
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async update() {}

  public async deleteById() {}
}
