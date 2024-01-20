import { Types } from "mongoose";
import { Subjects } from "../enums/subjects";
import { Attachment } from "./Attachment";
import { Participant } from "./Participant";

export interface MessageUpdatedEvent {
  subject: Subjects.MessageUpdated;
  data: {
    id: string;
    conversation_id: Types.ObjectId;
    sender_id: Types.ObjectId;
    content: string;
    type: string;
    attachments?: Attachment[];
    parent_message_id?: Types.ObjectId | null;
    status: string;
    participants: Participant[];
    deleted: number;
    version: number;
  };
}
