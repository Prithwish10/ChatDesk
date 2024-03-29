import { Subjects } from "../enums/subjects";
import { Participant } from "./Participant";

export interface ConversationCreatedEvent {
  subject: Subjects.ConversationCreated;
  data: {
    id: string;
    participants: Participant[];
    isGroup: boolean;
    group_name?: string;
    group_photo?: string;
    deleted: number;
    version: number;
  };
}