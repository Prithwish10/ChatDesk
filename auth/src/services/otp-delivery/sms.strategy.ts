import { Service } from 'typedi';
import { NotificationType } from '@pdchat/common';
import { HighPriorityNotificationPublisher } from '../../events/publishers/High-priority-notification-publisher';
import { IOtpDeliveryStrategy } from './otp-delivery.strategy';
import { natsWrapper } from '../../loaders/NatsWrapper';
import { signinSMSOTP } from '../../utils/notification-templates/signin-otp-sms.template';

@Service()
export class SMSDeliveryStrategy implements IOtpDeliveryStrategy {
  async sendOtp(recipient: string, otp: string): Promise<void> {
    await new HighPriorityNotificationPublisher(natsWrapper.client).publish({
      recipientId: recipient,
      content: {
        body: signinSMSOTP.replace('[XXXXXX]', otp),
      },
      status: 'sent',
      type: NotificationType.SMS,
    });
  }
}
