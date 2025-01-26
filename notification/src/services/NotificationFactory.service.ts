import { Service } from 'typedi';
import { NotificationType } from '@pdchat/common';
import { INotificationStrategy } from '../interfaces/INotificationStrategy';
import { EmailNotificationStrategy } from './strategies/EmailNotificationStrategy';
import { SMSNotificationStrategy } from './strategies/SMSNotificationStrategy';

@Service()
export class NotificationFactory {
  static createNotification(type: NotificationType): INotificationStrategy {
    switch (type) {
      case NotificationType.EMAIL:
        return new EmailNotificationStrategy();
      case NotificationType.SMS:
        return new SMSNotificationStrategy();
      default:
        throw new Error(`Notification type ${type} not supported.`);
    }
  }
}
