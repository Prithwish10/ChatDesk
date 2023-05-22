import mongoose from "mongoose";
import { Conversation } from "../interfaces/Conversation";
import ParticipantSchema from "./ParticipantSchema";

const conversationSchema = new mongoose.Schema<Conversation>({
  participants: [ParticipantSchema],
  isGroup: {
    type: Boolean,
    required: true,
    default: false,
  },
  group_name: {
    type: String,
    required: true,
    default: null,
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

export default mongoose.model<Conversation>("Conversation", conversationSchema);
