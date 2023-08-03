import mongoose from "mongoose";
import { Reaction } from "../../interfaces/v1/Reaction";

const reactionSchema = new mongoose.Schema<Reaction>({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reaction: {
    type: String,
    required: true,
  }
});

export default reactionSchema;
