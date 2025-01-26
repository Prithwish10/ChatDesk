import { Service } from 'typedi';
import { NotificationType } from '@pdchat/common';
import { HighPriorityNotificationPublisher } from '../../events/publishers/High-priority-notification-publisher';
import { IOtpDeliveryStrategy } from './otp-delivery.strategy';
import { natsWrapper } from '../../loaders/NatsWrapper';
import {
  signinOtpEmailBody,
  signinOtpEmailSubject,
} from '../../utils/notification-templates/signin-otp-email.template';

@Service()
export class EmailDeliveryStrategy implements IOtpDeliveryStrategy {
  async sendOtp(recipient: string, otp: string, username: string): Promise<void> {
    await new HighPriorityNotificationPublisher(natsWrapper.client).publish({
      recipientId: recipient,
      content: {
        subjectLine: signinOtpEmailSubject,
        body: signinOtpEmailBody.replace("[User's First Name]", username).replace('[XXXXXX]', otp),
      },
      status: 'sent',
      type: NotificationType.EMAIL,
    });
  }
}
