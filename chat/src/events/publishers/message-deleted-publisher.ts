import { MessageDeletedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class MessageDeletedPublisher extends Publisher<MessageDeletedEvent> {
  subject: Subjects.MessageDeleted = Subjects.MessageDeleted;
}
