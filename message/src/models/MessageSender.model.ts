import mongoose from 'mongoose';
import { IMessageSender } from '../interfaces/IMessageSender';

const messageSenderSchema = new mongoose.Schema<IMessageSender>({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  senderFirstName: {
    type: String,
    required: true,
  },
  senderLastName: {
    type: String,
    required: true,
  },
  senderImage: {
    type: String,
    required: false,
  },
});

export default messageSenderSchema;
