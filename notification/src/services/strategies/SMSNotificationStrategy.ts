import twilio from 'twilio';
import { INotificationAttrs } from '../../interfaces/INotificationAttrs';
import { INotificationStrategy } from '../../interfaces/INotificationStrategy';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

export class SMSNotificationStrategy implements INotificationStrategy {
  private twilioClient;

  constructor() {
    this.twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
  }

  async sendNotification(payload: INotificationAttrs): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body: payload.content.body,
        from: config.TWILIO_PHONE_NUMBER,
        to: payload.recipientId,
      });

      logger.info(`SMS sent successfully to: ${payload.recipientId}`);
    } catch (error) {
      logger.info(`SMS failed to send to: ${payload.recipientId}`);
    }
  }
}
