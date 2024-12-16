import sgMail from '@sendgrid/mail';
import { Service } from 'typedi';
import { INotificationAttrs } from '../../interfaces/INotificationAttrs';
import { INotificationStrategy } from '../../interfaces/INotificationStrategy';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

@Service()
export class EmailNotificationStrategy implements INotificationStrategy {
  constructor() {
    sgMail.setApiKey(config.SENDGRID_API_KEY as string);
  }

  async sendNotification(payload: INotificationAttrs): Promise<void> {
    if (!payload.recipientId || !payload.content.body || !payload.content.subjectLine) {
      throw new Error('Recipient and content are required for email notification');
    }

    const message = {
      to: payload.recipientId,
      from: config.EMAIL_SENDER as string,
      subject: payload.content.subjectLine,
      html: payload.content.body,
    };

    logger.info(`Email sent to ${payload.recipientId}`);
    try {
      await sgMail.send(message);
    } catch (error) {
      logger.info(`Failed to send email to ${payload.recipientId}`);
    }
  }
}
