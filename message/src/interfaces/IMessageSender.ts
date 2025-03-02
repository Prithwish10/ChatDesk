import {Types} from 'mongoose';

export interface IMessageSender {
  senderId: Types.ObjectId;
  senderFirstName: string;
  senderLastName: string;
  senderImage?: string;
}
