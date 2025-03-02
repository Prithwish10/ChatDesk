import { Types } from "mongoose";
import { IAttachment } from "./IAttachment";
import { IReaction } from './IReaction';
import mongoose from "mongoose";
import { IMessageSender } from "./IMessageSender";

// An interface that describes the properties required to create a new Message.
export interface IMessageAttrs {
  conversationId: Types.ObjectId;
  messageId: string;
  sender: IMessageSender;
  content: string;
  type: string;
  attachments?: IAttachment[];
  reactions?: IReaction[];
  parentMessageId?: Types.ObjectId | null;
  status: string;
  deleted: number;
}

// An interface that describes the properties that a Message Model has.
export interface IMessageModel extends mongoose.Model<IMessageDoc> {
  build(attrs: IMessageAttrs): IMessageDoc;
  bulkInsert(messages: IMessageAttrs[]): Promise<IMessageDoc[]>;
}

export interface IMessageDoc extends IMessageAttrs, mongoose.Document {
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
