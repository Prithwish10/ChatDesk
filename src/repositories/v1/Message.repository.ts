import { Service } from "typedi";
import Logger from "../../loaders/Logger";

@Service()
export class MessageRepository {
  constructor(private readonly logger: Logger) {}

  public async create() {}

  public async get() {}

  public async getById() {}

  public async updateById() {}

  public async deleteById() {}
}
