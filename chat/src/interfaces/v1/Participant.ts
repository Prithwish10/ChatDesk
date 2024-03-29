import { Types } from "mongoose";

export interface Participant {
  user_id: Types.ObjectId;
  role: string;
  status: string;
  last_checked_conversation_at?: Date;
  isAdmin?: boolean;
}
