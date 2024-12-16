import mongoose from 'mongoose';
import { INotificationAttrs } from './INotificationAttrs';

// An interface that describes the properties that a User Document has.
export interface INotificationDoc extends INotificationAttrs, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  version: number;
}
