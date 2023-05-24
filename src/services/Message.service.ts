import { Service } from "typedi";
import { MessageRepository } from "../repositories/v1/Message.repository";
import Logger from "../loaders/Logger";

@Service()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly logger: Logger
  ) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
