import { Types } from "mongoose";

export interface Participant {
  user_id: Types.ObjectId;
  role: string;
  status: String;
  isAdmin?: boolean;
}
