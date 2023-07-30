import { ConversationUpdatedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class ConversationUpdatedPublisher extends Publisher<ConversationUpdatedEvent> {
  subject: Subjects.ConversationUpdated = Subjects.ConversationUpdated;
}
