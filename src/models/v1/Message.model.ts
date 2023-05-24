import mongoose from "mongoose";
import { Message } from "../../interfaces/v1/Message";
import AttachmentModel from "./Attachment.model";

const messageSchema = new mongoose.Schema<Message>({
  conversation_id: {
    type: String,
    required: true,
  },
  sender_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  attachments: {
    type: [AttachmentModel],
    required: false,
  },
  parent_message_id: {
    type: String,
    required: false,
    ref: "Message",
  },
  deleted: {
    type: Number,
    default: 0,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Message>("Message", messageSchema);
