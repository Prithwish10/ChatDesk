import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { OTPDeliveryFactory } from './OTPDeliverFactory.service';
import { OTPDeliveryType } from '../enums/OTPDeliveryType';
import { OtpGenerator } from '../utils/OtpGenerator';
import { OTPRepository } from '../repositories/otp.repository';
import { generateOtpExpiration } from '../utils/GenerateOTPExpiration';
import { Api400Error } from '@pdchat/common';
import { RecipientValidatorFactory } from './RecipientValidatorFactory.service';
import { RecipientService } from './Recipient.service';

@Service()
export class SendOTPService {
  constructor(
    private readonly _otpRepository: OTPRepository,
    private readonly _otpDeliveryFactory: OTPDeliveryFactory,
    private readonly _recipientService: RecipientService,
    private readonly _recipientValidatorFactory: RecipientValidatorFactory,
  ) {}

  /**
   * Authenticates a user by their email and password, generating a JSON Web Token (JWT) upon successful authentication.
   * @async
   * @param {OTPDeliveryType} type - The type of otp user wants to login with.
   * @param {string} recipientId - The email address or the phone number of the user attempting to sign in.
   * @returns {Promise<string>} A Promise that resolves to an object containing nothing.
   * @throws {Error} Any other error that occurs during the authentication process.
   */
  public async sendOTP(type: OTPDeliveryType, recipientId: string): Promise<void> {
    try {
      // Determine the recipient type (email or phone)
      const recipientType = this._recipientService.getRecipientType(recipientId);
      const recipientValidator = this._recipientValidatorFactory.getValidator(recipientType);
      if (!recipientValidator) {
        throw new Api400Error(`Unsupported recipient type for OTP delivery: ${recipientType}`);
      }

      const user = await recipientValidator.validate(recipientId);
      if (!user) {
        throw new Api400Error('User not found.');
      }

      const generatedOTP = OtpGenerator.generateOtp();
      const expirationDate = generateOtpExpiration();
      await this._otpRepository.saveOtp({
        recipientId,
        hashedOtp: generatedOTP,
        expiration: expirationDate,
      });
      const otpStrategy = this._otpDeliveryFactory.getStrategy(type);
      await otpStrategy.sendOtp(recipientId, generatedOTP, user.firstName);
    } catch (error) {
      logger.error(`Error in service while sending OTP: ${error}`);
      throw error;
    }
  }
}
