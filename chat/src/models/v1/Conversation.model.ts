import mongoose from "mongoose";
import { Conversation } from "../../interfaces/v1/Conversation";
import ParticipantSchema from "./Participant.model";

const conversationSchema = new mongoose.Schema<Conversation>(
  {
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
    },
    deleted: {
      type: Number,
      default: 0,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    last_message_timestamp: {
      type: Date,
      default: Date.now,
    },
    last_message: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

export default mongoose.model<Conversation>("Conversation", conversationSchema);
