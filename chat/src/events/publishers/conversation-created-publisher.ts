import {ConversationCreatedEvent, Publisher, Subjects} from "@pdchat/common";
import { Service } from "typedi";

@Service()
export class ConversationCreatedPublisher extends Publisher<ConversationCreatedEvent> {
    subject: Subjects.ConversationCreated = Subjects.ConversationCreated;
}