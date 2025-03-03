import mongoose from 'mongoose';
import {
  IConversationAttrs,
  IConversationDoc,
  IConversationModel,
} from '../interfaces/IConversation';
import ParticipantSchema from './Participant.model';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

const conversationSchema = new mongoose.Schema(
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
    groupName: {
      type: String,
      trim: true,
      required: false,
    },
    groupPhoto: {
      type: String,
      required: false,
    },
    deleted: {
      type: Number,
      default: 0,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    lastMessageTimestamp: {
      type: Date,
      default: Date.now,
    },
    lastMessage: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

conversationSchema.set('versionKey', 'version');
conversationSchema.plugin(updateIfCurrentPlugin);

conversationSchema.statics.build = (attrs: IConversationAttrs) => {
  return new Conversation(attrs);
};

const Conversation = mongoose.model<IConversationDoc, IConversationModel>(
  'Conversation',
  conversationSchema,
);

export { Conversation };
