import mongoose from 'mongoose';
import { INotificationAttrs } from './INotificationAttrs';
import { INotificationDoc } from './INotificationDoc';

// An interface that describes the properties that a User Model has.
export interface INotificationModel extends mongoose.Model<INotificationDoc> {
  build(attrs: INotificationAttrs): INotificationDoc;
}
