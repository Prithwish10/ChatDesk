import { Message } from "node-nats-streaming";
import Container from "typedi";
import { Subjects, Listener, UserCreatedEvent } from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { UserRepository } from "../../repositories/v1/User.repository";
import { Types } from "mongoose";
import { logger } from "../../loaders/logger";

const userRepository = Container.get(UserRepository);

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message): Promise<void> {
    const { id, firstName, lastName, mobileNumber, email } = data;

    await userRepository.create({
      _id: new Types.ObjectId(id),
      firstName,
      lastName,
      mobileNumber,
      email,
    });
    logger.info('Acknowledging the user creation.')

    msg.ack();
  }
}
