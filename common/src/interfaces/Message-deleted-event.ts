import { Subjects } from "../enums/subjects";

export interface MessageDeletedEvent {
  subject: Subjects.MessageDeleted;
  data: {
    id: string;
    version: number;
  };
}
