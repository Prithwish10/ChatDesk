import { Types } from "mongoose";
import { Subjects } from "../enums/subjects";
import { Attachment } from "./Attachment";
import { Reaction } from "./Reaction";

export interface MessageCreatedEvent {
  subject: Subjects.MessageCreated;
  data: {
    conversation_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    content: string;
    type: string;
    attachments?: Attachment[];
    parent_message_id?: Types.ObjectId | null;
    status: string;
    deleted: number;
    reactions?: Reaction[];
  };
}
