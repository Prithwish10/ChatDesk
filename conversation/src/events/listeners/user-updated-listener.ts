import { Message } from "node-nats-streaming";
import Container from "typedi";
import {
  Subjects,
  Listener,
  UserUpdatedEvent,
  Api404Error,
} from "@pdchat/common";
import { queueGroupName } from "./queue-group-name";
import { UserRepository } from "../../repositories/User.repository";
import { logger } from "../../loaders/logger";

const userRepository = Container.get(UserRepository);

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  subject: Subjects.UserUpdated = Subjects.UserUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: UserUpdatedEvent["data"], msg: Message): Promise<void> {
    const { id, firstName, lastName, countryCode, mobileNumber, email, version } = data;

    const user = await userRepository.findByIdAndPreviousVersion(id, version);
    if (!user) {
      throw new Api404Error("User not found.");
    }

    await userRepository.updateByUserDoc(user, {
      firstName,
      lastName,
      countryCode,
      mobileNumber,
      email,
    });
    logger.info("Acknowledging the user updation.");

    msg.ack();
  }
}
