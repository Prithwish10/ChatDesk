import mongoose, {Types} from "mongoose";
import { IParticipant } from "./IParticipant";

// An interface that describes the properties required to create a new Conversation.
export interface IConversationAttrs {
  participants: IParticipant[];
  isGroup: boolean;
  groupName?: string;
  groupPhoto?: string;
  deleted: number;
  lastMessageTimestamp: Date;
  lastMessage: string;
  createdBy: Types.ObjectId;
}

// An interface that describes the properties that a Conversation Model has.
export interface IConversationModel extends mongoose.Model<IConversationDoc> {
  build(attrs: IConversationAttrs): IConversationDoc;
}

export interface IConversationDoc extends IConversationAttrs, mongoose.Document {
  version: number;
  createdAt: Date;
  updatedAt: Date;
}