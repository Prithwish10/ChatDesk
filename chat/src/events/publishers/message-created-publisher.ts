import { MessageCreatedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class MessageCreatedPublisher extends Publisher<MessageCreatedEvent> {
  subject: Subjects.MessageCreated = Subjects.MessageCreated;
}
