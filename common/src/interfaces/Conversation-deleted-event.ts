import { Subjects } from "../enums/subjects";

export interface ConversationDeletedEvent {
  subject: Subjects.ConversationDeleted;
  data: {
    id: string;
    version: number;
  };
}
