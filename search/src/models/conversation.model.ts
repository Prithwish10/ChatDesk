import mongoose from "mongoose";
import { Conversation } from "../interfaces/Conversation";
import ParticipantSchema from "./Participant.model";

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
    trim: true,
    required: false,
  },
  group_photo: {
    type: String,
    required: false,
    default:
      "https://cdn5.vectorstock.com/i/1000x1000/84/89/group-chat-contact-icon-office-team-or-teamwork-vector-23828489.jpg",
  },
  deleted: {
    type: Number,
    default: 0,
    required: true,
  },
});

export default mongoose.model<Conversation>("Conversation", conversationSchema);
