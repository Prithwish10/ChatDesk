import { Attachment } from "./Attachment";

export interface Message {
  _id?: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: Attachment[];
  parent_message_id?: string;
  created_at?: Date;
  updated_at?: Date;
}
