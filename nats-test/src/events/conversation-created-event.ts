import { Subjects } from "./subjects";

export interface ConversationCreatedEvent {
  subject: Subjects.ConversationCreated;
  data: {
    id: string;
    group_name: string;
    group_photo: string;
    deleted: number;
  };
}
