import { Types } from "mongoose";
import { Subjects } from "../enums/subjects";
import { Attachment } from "./Attachment";
import { IReaction } from "./IReaction";

export interface MessageCreatedEvent {
  subject: Subjects.MessageCreated;
  data: {
    conversation_id: Types.ObjectId;
    sender: {
      id: Types.ObjectId;
      firstname: string;
      lastname: string;
      image?: string;
    };
    content: string;
    type: string;
    attachments?: Attachment[];
    parent_message_id?: Types.ObjectId | null;
    status: string;
    deleted: number;
    reactions?: IReaction[];
  };
}
