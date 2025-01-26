import { Service } from 'typedi';
import { INotificationAttrs } from '../../interfaces/INotificationAttrs';
import { INotificationStrategy } from '../../interfaces/INotificationStrategy';
import webPush from 'web-push';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

@Service()
export class BrowserPushNotificationStrategy implements INotificationStrategy {
  constructor() {
    webPush.setVapidDetails(
      `mailto:${config.VAPID_EMAIL}`,
      config.VAPID_PUBLIC_KEY as string,
      config.VAPID_PRIVATE_KEY as string,
    );
  }

  async sendNotification(payload: INotificationAttrs): Promise<void> {
    if (!payload.recipientId || !payload.content.subjectLine || !payload.content.body) {
      throw new Error('Recipient and content are required for browser notification');
    }

    try {
      const subscription = JSON.parse(payload.recipientId);
      await webPush.sendNotification(subscription, JSON.stringify(payload.content));
      logger.info(`Browser notification sent to ${payload.recipientId}`);
    } catch (error) {
      logger.error(`Failed to send browser notification: ${error}`);
    }
  }
}
