import { MessageUpdatedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class MessageUpdatedPublisher extends Publisher<MessageUpdatedEvent> {
  subject: Subjects.MessageUpdated = Subjects.MessageUpdated;
}
