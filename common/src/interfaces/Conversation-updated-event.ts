import { Subjects } from "../enums/subjects";

export interface ConversationUpdatedEvent {
  subject: Subjects.ConversationUpdated;
  data: {
    id: string;
    group_name: string;
    group_photo: string;
    deleted: number;
  };
}
