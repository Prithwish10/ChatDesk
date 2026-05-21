import { Service } from 'typedi';
import { EmailDeliveryStrategy } from './otp-delivery/email.strategy';
import { SMSDeliveryStrategy } from './otp-delivery/sms.strategy';
import { IOtpDeliveryStrategy } from './otp-delivery/otp-delivery.strategy';
import { OTPDeliveryType } from '../enums/OTPDeliveryType';
import { Api400Error } from '@pdchat/common';
/**
 * Registry-based factory for OTP delivery strategies.
 *
 * Adding a new delivery channel requires:
 *   1. Implement IOtpDeliveryStrategy in a new file under otp-delivery/
 *   2. Add the new value to the OTPDeliveryType enum
 *   3. Inject the new strategy here and add one line to the registry Map
 *
 * No other class needs to change.
 */
@Service()
export class OTPDeliveryFactory {
  private readonly registry: Map<OTPDeliveryType, IOtpDeliveryStrategy>;
  constructor(emailStrategy: EmailDeliveryStrategy, smsStrategy: SMSDeliveryStrategy) {
    this.registry = new Map<OTPDeliveryType, IOtpDeliveryStrategy>([
      [OTPDeliveryType.EMAIL, emailStrategy],
      [OTPDeliveryType.SMS, smsStrategy],
    ]);
  } /**
   * Returns the strategy for a single delivery channel.
   * @throws {Api400Error} if the channel is not registered.
   */
  getStrategy(type: OTPDeliveryType): IOtpDeliveryStrategy {
    const strategy = this.registry.get(type);
    if (!strategy) {
      throw new Api400Error(`OTP delivery channel '${type}' is not supported.`);
    }
    return strategy;
  } /**
   * Returns strategies for all requested channels, validated upfront.
   * Supports multi-channel fan-out (e.g. email + sms simultaneously).
   * @throws {Api400Error} if any requested channel is not registered.
   */
  getStrategies(types: OTPDeliveryType[]): IOtpDeliveryStrategy[] {
    return types.map((type) => this.getStrategy(type));
  }
}
