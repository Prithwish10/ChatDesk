import { Participant } from "./Participant";

export interface Conversation {
  _id?: string,
  participants: Participant[],
  isGroup: boolean,
  group_name?: string,
  group_photo?: string,
  deleted: Number,
  last_ckecked?: Date,
  created_at?: Date,
  updated_at?: Date
  last_message_timestamp: Date
}
