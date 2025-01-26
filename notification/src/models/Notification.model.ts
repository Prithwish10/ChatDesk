import mongoose from 'mongoose';
import { INotificationAttrs } from '../interfaces/INotificationAttrs';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { NotificationType } from '@pdchat/common';
import { NotificationStatus } from '../enums/NotificationStatus.enum';
import { INotificationDoc } from '../interfaces/INotificationDoc';
import { INotificationModel } from '../interfaces/INotificationModel';
import notificationContentSchema from './NotificationContent.model';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    content: {
      type: notificationContentSchema,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      required: true,
      default: NotificationStatus.SENT,
    },
    error: {
      type: String,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
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

notificationSchema.statics.build = (attrs: INotificationAttrs) => {
  return new Notification(attrs);
};

notificationSchema.set('versionKey', 'version');
notificationSchema.plugin(updateIfCurrentPlugin);

notificationSchema.pre('updateOne', function (next) {
  this.updateOne({}, { $set: { updatedAt: new Date() } });
  next();
});

const Notification = mongoose.model<INotificationDoc, INotificationModel>(
  'Notification',
  notificationSchema,
);

export { Notification };
