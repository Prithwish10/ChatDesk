import { Service } from 'typedi';
import { EmailDeliveryStrategy } from './otp-delivery/email.strategy';
import { SMSDeliveryStrategy } from './otp-delivery/sms.strategy';
import { Api400Error } from '@pdchat/common';

@Service()
export class OTPDeliveryFactory {
  constructor(
    private readonly _emailDeliveryStrategy: EmailDeliveryStrategy,
    private readonly _smsDeliveryStrategy: SMSDeliveryStrategy,
  ) {}

  getStrategy(type: string) {
    switch (type) {
      case 'email':
        return this._emailDeliveryStrategy;
      case 'sms':
        return this._smsDeliveryStrategy;
      default:
        throw new Api400Error(`OTP type ${type} not supported.`);
    }
  }
}
