import { Types } from "mongoose";
import { Attachment } from "./Attachment";
import { Reaction } from "./Reaction";

export interface Message {
  _id?: string;
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  content: string;
  attachments?: Attachment[];
  parent_message_id?: Types.ObjectId | null;
  deleted: number;
  reactions?: Reaction[];
  version?: number;
  created_at?: Date;
  updated_at?: Date;
}
