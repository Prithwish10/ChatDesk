import { ParticipantStatus } from "../../enums/ParticipantStatus";

export interface Participant {
  user_id: string;
  role: string;
  status: String;
  isAdmin?: boolean;
}
