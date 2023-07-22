import { Types } from "mongoose";
import { Participant } from "./Participant";

export interface Conversation {
  _id?: Types.ObjectId,
  participants: Participant[],
  isGroup: boolean,
  group_name?: string,
  group_photo?: string,
  deleted: Number,
}
