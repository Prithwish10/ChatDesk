import mongoose from "mongoose";
import { Participant } from "../interfaces/Participant";
import { ParticipantStatus } from "../enums/ParticipantStatus";

const participantSchema = new mongoose.Schema<Participant>({
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
    required: true,
    enum: Object.values(ParticipantStatus),
    default: ParticipantStatus.Active,
  },
});

export default participantSchema;
