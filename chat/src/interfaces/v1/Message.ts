import { Types } from "mongoose";
import { Attachment } from "./Attachment";
import { Reaction } from "./Reaction";
import mongoose from "mongoose";

// An interface that describes the properties required to create a new Message.
export interface MessageAttrs {
  conversation_id: Types.ObjectId;
  sender_id: Types.ObjectId;
  content: string;
  type: string;
  attachments?: Attachment[];
  parent_message_id?: Types.ObjectId | null;
  deleted: number;
  reactions?: Reaction[];
}

// An interface that describes the properties that a Message Model has.
export interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

export interface MessageDoc extends MessageAttrs, mongoose.Document {
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
