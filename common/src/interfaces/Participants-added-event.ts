import { Subjects } from "../enums/subjects";
import { IParticipant } from "./IParticipant";

export interface ParticipantsAddedEvent {
  subject: Subjects.ParticipantsAdded;
  data: {
    conversationId: string;
    participants: IParticipant[];
    version: number;
  };
}
