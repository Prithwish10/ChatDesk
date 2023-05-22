import mongoose from "mongoose";
import { Participant } from "../interfaces/Participant";

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
  isAdmin: {
    type: Boolean,
    required: true,
  },
});

export default mongoose.model<Participant>("Participant", participantSchema);
