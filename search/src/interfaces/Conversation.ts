import mongoose, { Types } from "mongoose";
import { Participant } from "./Participant";

// An interface that describes the properties required to create a new Conversation.
export interface ConversationAttrs {
  _id?: Types.ObjectId
  participants: Participant[];
  isGroup?: boolean;
  group_name?: string;
  group_photo?: string;
  deleted: number;
}

// An interface that describes the properties that a Conversation Model has.
export interface ConversationModel extends mongoose.Model<ConversationDoc> {
  build(attrs: ConversationAttrs): ConversationDoc;
}

// An interface that describes the properties that a User Document has.
export interface ConversationDoc extends mongoose.Document {
  participants: Participant[];
  isGroup?: boolean;
  group_name?: string;
  group_photo?: string;
  deleted: number;
  version: number;
}