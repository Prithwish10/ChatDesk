import { Subjects } from "../enums/subjects";
import { Participant } from "./Participant";

export interface ParticipantRemovedEvent {
  subject: Subjects.ParticipantRemoved;
  data: {
    conversationId: string;
    participantId: string;
    version: number;
  };
}
