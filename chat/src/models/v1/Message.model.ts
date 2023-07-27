import mongoose from "mongoose";
import { Message } from "../../interfaces/v1/Message";
import ReactionSchema from "./Reaction.model";
import AttachmentModel from "./Attachment.model";

const messageSchema = new mongoose.Schema<Message>(
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
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
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

messageSchema.pre("save", async function (next) {
  const message = this as Message;

  // Update the last_message & last_message_timestamp in the associated conversation
  await mongoose.model("Conversation").updateOne(
    { _id: message.conversation_id },
    {
      $set: {
        last_message_timestamp: message.created_at,
        last_message: message.content,
      },
    }
  );

  next();
});

export default mongoose.model<Message>("Message", messageSchema);
