import mongoose from "mongoose";
import { Message } from "../interfaces/Message";
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
  attachments: [AttachmentModel],
  parent_message_id: {
    type: String,
    required: false,
    ref: "Message",
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
