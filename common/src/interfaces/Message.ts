import { Types } from "mongoose";
import { Attachment } from "./Attachment";
import { Reaction } from "./Reaction";

export interface Message {
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  content: string;
  type: string;
  attachments?: Attachment[];
  parent_message_id?: Types.ObjectId | null;
  status: string;
  deleted: number;
  reactions?: Reaction[];
}
