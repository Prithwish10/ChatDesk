import mongoose from "mongoose";
import { Conversation } from "../../interfaces/v1/Conversation";
import ParticipantSchema from "./ParticipantSchema";

const conversationSchema = new mongoose.Schema<Conversation>({
  participants: {
    required: true,
    type: [ParticipantSchema],
  },
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
  group_name: {
    type: String,
    required: false,
  },
  group_photo: {
    type: String,
    required: false,
  },
  deleted: {
    type: Number,
    default: 0,
    required: true,
  },
  last_ckecked: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_message_timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<Conversation>("Conversation", conversationSchema);
