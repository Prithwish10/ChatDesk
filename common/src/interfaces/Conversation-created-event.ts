import { Subjects } from "../enums/subjects";
import { IParticipant } from "./IParticipant";

export interface ConversationCreatedEvent {
  subject: Subjects.ConversationCreated;
  data: {
    id: string;
    participants: IParticipant[];
    isGroup: boolean;
    group_name?: string;
    group_photo?: string;
    deleted: number;
    version: number;
  };
}
