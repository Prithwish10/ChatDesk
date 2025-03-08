import mongoose from 'mongoose';
import { IParticipant } from '../interfaces/IParticipant';
import { ParticipantStatus } from '../enums/ParticipantStatus';

const participantSchema = new mongoose.Schema<IParticipant>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    isAdmin: {
      type: Boolean,
      required: false,
    },
    isConversationDeleted: {
      type: Boolean,
      required: true,
      default: false,
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export default participantSchema;
