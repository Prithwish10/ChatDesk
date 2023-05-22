import { Participant } from "./Participant";

export interface Conversation {
  participants: Participant[];
  isGroup: boolean;
  group_name: string | null;
  created_at?: Date;
  updated_at?: Date;
}
