import { Service } from "typedi";
import { MessageService } from "../services/Message.service";

@Service()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async update() {}

  public async deleteById() {}
}
