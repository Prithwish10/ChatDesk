import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import { Types } from "mongoose";
import {
  Subjects,
  Listener,
  UserUpdatedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { UserRepository } from "../../repositories/User.repository";
import { logger } from "../../loaders/logger";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName: string = queueGroupName;
  private _userRepository: UserRepository;

  constructor(client: Stan) {
    super(client);
    this._userRepository = Container.get(UserRepository);
  }

  async onMessage(data: UserUpdatedEvent["data"], msg: Message): Promise<void> {
    const { id, firstName, lastName, mobileNumber, email } = data;

    try {
      const user = await this._userRepository.findById(id);
      if (!user) {
        throw new Api404Error("User not found.");
      }

      await this._userRepository.update(id, {
        firstName,
        lastName,
        mobileNumber,
        email,
      });
      logger.info("Acknowledging the user updation.");
    } catch (error) {
      logger.info(`Error occured in User Updated Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
