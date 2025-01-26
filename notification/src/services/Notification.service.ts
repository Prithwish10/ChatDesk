import { INotificationAttrs } from '../interfaces/INotificationAttrs';
import { INotificationStrategy } from '../interfaces/INotificationStrategy';

export class NotificationService {
  private strategy: INotificationStrategy;

  constructor(strategy: INotificationStrategy) {
    this.strategy = strategy;
  }

  async notify(payload: INotificationAttrs) {
    this.strategy.sendNotification(payload);
  }
}
