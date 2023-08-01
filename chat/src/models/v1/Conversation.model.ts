import mongoose from "mongoose";
import {
  ConversationAttrs,
  ConversationDoc,
  ConversationModel,
} from "../../interfaces/v1/Conversation";
import ParticipantSchema from "./Participant.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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
    createdAt: {
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
      default: "",
    },
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

conversationSchema.set("versionKey", "version");
conversationSchema.plugin(updateIfCurrentPlugin);

conversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

const Conversation = mongoose.model<ConversationDoc, ConversationModel>(
  "Conversation",
  conversationSchema
);

export { Conversation };
