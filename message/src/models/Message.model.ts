import mongoose from 'mongoose';
import { IMessageAttrs, IMessageDoc, IMessageModel } from '../interfaces/IMessage';
import ReactionSchema from './Reaction.model';
import messageSenderSchema from './MessageSender.model';
import AttachmentModel from './Attachment.model';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { MessageType } from '../enums/MessageType';
import { MessageStatus } from '../enums/MessageStatus';

const messageSchema = new mongoose.Schema<IMessageDoc>(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    messageId: {
      type: String,
      required: true,
    },
    sender: {
      type: messageSenderSchema,
      required: true,
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
      default: MessageType.General,
    },
    attachments: {
      type: [AttachmentModel],
      required: false,
    },
    reactions: {
      type: [ReactionSchema],
      required: false,
    },
    parentMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      default: null,
      ref: 'Message',
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(MessageStatus),
      default: MessageStatus.Sent,
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
  },
);

messageSchema.set('versionKey', 'version');
messageSchema.plugin(updateIfCurrentPlugin);
messageSchema.index({ conversationId: 1, messageId: 1 });

messageSchema.statics.build = (attrs: IMessageAttrs) => {
  return new Message(attrs);
};

const Message = mongoose.model<IMessageDoc, IMessageModel>('Message', messageSchema);

export { Message };
