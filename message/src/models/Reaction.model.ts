import mongoose from 'mongoose';
import { IReaction } from '../interfaces/IReaction';

const reactionSchema = new mongoose.Schema<IReaction>({
  user: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
  },
  reaction: {
    type: String,
    required: true,
  },
});

export default reactionSchema;
