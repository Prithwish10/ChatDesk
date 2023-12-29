import { Subjects } from "../enums/subjects";

export interface ParticipantRemovedEvent {
  subject: Subjects.ParticipantRemoved;
  data: {
    conversationId: string;
    participantId: string;
    version: number;
  };
}
