import mongoose from "mongoose";
import { MessageAttrs, MessageDoc, MessageModel } from "../../interfaces/v1/Message";
import ReactionSchema from "./Reaction.model";
import AttachmentModel from "./Attachment.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ParticipantStatus } from "../../enums/ParticipantStatus";
import { MessageType } from "../../enums/MessageType";

const messageSchema = new mongoose.Schema<MessageDoc>(
  {
    conversation_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Conversation",
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      trim: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(MessageType),
      default: MessageType.General
    },
    attachments: {
      type: [AttachmentModel],
      required: false,
    },
    parent_message_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: "Message",
    },
    deleted: {
      type: Number,
      default: 0,
      required: true,
    },
    reactions: {
      type: [ReactionSchema],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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


messageSchema.set("versionKey", "version");
messageSchema.plugin(updateIfCurrentPlugin);

messageSchema.pre("save", async function (next) {
  const message = this as MessageDoc;

  // Update the last_message & last_message_timestamp in the associated conversation
  await mongoose.model("Conversation").updateOne(
    { _id: message.conversation_id },
    {
      $set: {
        last_message_timestamp: message.createdAt,
        last_message: message.content,
      },
    }
  );

  next();
});

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

const Message = mongoose.model<MessageDoc, MessageModel>(
  "Message",
  messageSchema
);

export { Message };
