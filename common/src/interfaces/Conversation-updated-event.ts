import { Subjects } from "../enums/subjects";
import { IParticipant } from "./IParticipant";

export interface ConversationUpdatedEvent {
  subject: Subjects.ConversationUpdated;
  data: {
    id: string;
    participants: IParticipant[];
    group_name?: string;
    group_photo?: string;
    deleted: number;
    version: number;
  };
}
