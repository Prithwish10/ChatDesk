import { Subjects } from "../enums/subjects";
import { Participant } from "./Participant";

export interface ParticipantsAddedEvent {
  subject: Subjects.ParticipantsAdded;
  data: {
    id: string;
    participants: Participant[];
  };
}
