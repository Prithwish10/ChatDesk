import mongoose from "mongoose";
import { ConversationAttrs, ConversationDoc, ConversationModel } from "../interfaces/Conversation";
import ParticipantSchema from "./Participant.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Event } from "../interfaces/Event";

const conversationSchema = new mongoose.Schema({
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
    default:
      "https://cdn5.vectorstock.com/i/1000x1000/84/89/group-chat-contact-icon-office-team-or-teamwork-vector-23828489.jpg",
  },
  deleted: {
    type: Number,
    default: 0,
    required: true,
  },
});

conversationSchema.set("versionKey", "version");
conversationSchema.plugin(updateIfCurrentPlugin);

conversationSchema.statics.findByEvent = (event: Event) => {
  return Conversation.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

conversationSchema.statics.build = (attrs: ConversationAttrs) => {
  return new Conversation(attrs);
};

const Conversation = mongoose.model<ConversationDoc, ConversationModel>("Conversation", conversationSchema);

export { Conversation };
