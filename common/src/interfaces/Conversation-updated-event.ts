import { Subjects } from "../enums/subjects";
import { Participant } from "./Participant";

export interface ConversationUpdatedEvent {
  subject: Subjects.ConversationUpdated;
  data: {
    id: string;
    participants: Participant[];
    group_name?: string;
    group_photo?: string;
    deleted: number;
  };
}
