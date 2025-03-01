import mongoose from 'mongoose';
import { IReaction } from '../interfaces/IReaction';

const reactionSchema = new mongoose.Schema<IReaction>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reaction: {
    type: String,
    required: true,
  },
});

export default reactionSchema;
