import { ConversationDeletedEvent, Publisher, Subjects } from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class ConversationDeletedPublisher extends Publisher<ConversationDeletedEvent> {
  subject: Subjects.ConversationDeleted = Subjects.ConversationDeleted;
}
