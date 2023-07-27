import mongoose from "mongoose";
import { Participant } from "../../interfaces/v1/Participant";
import { ParticipantStatus } from "../../enums/ParticipantStatus";

const participantSchema = new mongoose.Schema<Participant>(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    role: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      enum: Object.values(ParticipantStatus),
      default: ParticipantStatus.Active,
    },
    last_checked_conversation_at: {
      type: Date,
      default: Date.now,
    },
    isAdmin: {
      type: Boolean,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export default participantSchema;
