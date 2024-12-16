import { INotificationAttrs } from '../../interfaces/INotificationAttrs';
import { INotificationStrategy } from '../../interfaces/INotificationStrategy';
import { logger } from '../../loaders/logger';

export class PushNotificationStrategy implements INotificationStrategy {
  sendNotification(payload: INotificationAttrs): Promise<void> {
    logger.info(`Payload for push notification: ${payload}`);
    throw new Error('Method not implemented.');
  }
}
