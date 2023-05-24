import mongoose from "mongoose";
import { Participant } from "../../interfaces/v1/Participant";
import { ParticipantStatus } from "../../enums/ParticipantStatus";

const participantSchema = new mongoose.Schema<Participant>({
  user_id: {
    type: String,
    required: true,
    ref: "User",
  },
  role: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(ParticipantStatus),
    default: ParticipantStatus.Active,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});

export default participantSchema;
