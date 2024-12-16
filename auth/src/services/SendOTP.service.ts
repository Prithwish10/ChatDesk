import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { OTPDeliveryFactory } from './OTPDeliverFactory.service';
import { OTPDeliveryType } from '../enums/OTPDeliveryType';

@Service()
export class SendOTPService {
  constructor(private readonly _otpDeliveryFactory: OTPDeliveryFactory) {}

  /**
   * Authenticates a user by their email and password, generating a JSON Web Token (JWT) upon successful authentication.
   * @async
   * @param {OTPDeliveryType} type - The type of otp user wants to login with.
   * @param {string} recipient - The email address or the phone number of the user attempting to sign in.
   * @param {string} otp - The OTP sent to the user.
   * @returns {Promise<string>} A Promise that resolves to an object containing nothing.
   * @throws {Error} Any other error that occurs during the authentication process.
   */
  public async sendOTP(
    type: OTPDeliveryType,
    recipient: string,
    otp: string,
    userFirstName: string,
  ): Promise<void> {
    try {
      const otpStrategy = this._otpDeliveryFactory.getStrategy(type);
      await otpStrategy.sendOtp(recipient, otp, userFirstName);
    } catch (error) {
      logger.error(`Error in service while sending OTP: ${error}`);
      throw error;
    }
  }
}
