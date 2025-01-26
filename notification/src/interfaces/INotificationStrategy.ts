import { INotificationAttrs } from './INotificationAttrs';

export interface INotificationStrategy {
  sendNotification(payload: INotificationAttrs): Promise<void>;
}
