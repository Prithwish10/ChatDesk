import { Service } from "typedi";
import { MessageRepository } from "../repositories/Message.repository";

@Service()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
