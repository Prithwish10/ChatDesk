import { Types } from "mongoose";
import { Attachment } from "./Attachment";

export interface Message {
  _id?: string,
  conversation_id: string,
  sender_id: Types.ObjectId,
  content: string,
  attachments?: Attachment[],
  parent_message_id?: Types.ObjectId | null,
  deleted: number
  created_at?: Date,
  updated_at?: Date
}
