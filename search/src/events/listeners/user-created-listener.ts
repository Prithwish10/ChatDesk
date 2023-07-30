import { Message, Stan } from "node-nats-streaming";
import Container from "typedi";
import { Subjects, Listener, UserCreatedEvent } from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import usersModel from "../../models/users.model";
import { UserRepository } from "../../repositories/User.repository";
import { Types } from "mongoose";
import { logger } from "../../loaders/logger";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName: string = queueGroupName;
  private _userRepository: UserRepository;

  constructor(client: Stan) {
    super(client);
    this._userRepository = Container.get(UserRepository);
  }

  async onMessage(data: UserCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, firstName, lastName, mobileNumber, email } = data;

    try {
      await this._userRepository.create({
        _id: new Types.ObjectId(id),
        firstName,
        lastName,
        mobileNumber,
        email,
      });
      logger.info("Acknowledging the user creation.");
    } catch (error) {
      logger.info(`Error occured in User Created Listener: ${error}`);
      throw error;
    }

    msg.ack();
  }
}
