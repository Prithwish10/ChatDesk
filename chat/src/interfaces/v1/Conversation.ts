import mongoose, {Types} from "mongoose";
import { Participant } from "./Participant";

// An interface that describes the properties required to create a new Conversation.
export interface ConversationAttrs {
  participants: Participant[];
  isGroup: boolean;
  group_name?: string;
  group_photo?: string;
  deleted: number;
  last_message_timestamp: Date;
  last_message: string;
  createdBy: Types.ObjectId;
}

// An interface that describes the properties that a Conversation Model has.
export interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

export interface ConversationDoc extends ConversationAttrs, mongoose.Document {
  version: number;
  createdAt: Date;
  updatedAt: Date;
}