import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { OTPDeliveryFactory } from './OTPDeliverFactory.service';
import { OTPDeliveryType } from '../enums/OTPDeliveryType';
import { OtpGenerator } from '../utils/OtpGenerator';
import { OTPRedisRepository } from '../repositories/otp-redis.repository';
import { PasswordManager } from './PasswordManager.service';
import { Api400Error, Api429Error } from '@pdchat/common';
import { RecipientValidatorFactory } from './RecipientValidatorFactory.service';
import { RecipientService } from './Recipient.service';
@Service()
export class SendOTPService {
  constructor(
    private readonly _otpRedisRepository: OTPRedisRepository,
    private readonly _otpDeliveryFactory: OTPDeliveryFactory,
    private readonly _recipientService: RecipientService,
    private readonly _recipientValidatorFactory: RecipientValidatorFactory,
  ) {}

  /**
   * Sends an OTP to the given recipient after validating the user and enforcing rate limits.
   * Supports multi-channel delivery — all requested channels are dispatched concurrently.
   * The OTP is stored in Redis with a fixed TTL — no MongoDB write is involved.
   *
   * @param {OTPDeliveryType[]} types - One or more delivery channels (email, sms, …).
   * @param {string} recipientId      - Email address or E.164 phone number.
   */
  public async sendOTP(types: OTPDeliveryType[], recipientId: string): Promise<void> {
    try {
      // 1. Enforce rate limit before doing any expensive work
      const limited = await this._otpRedisRepository.isRateLimited(recipientId);
      if (limited) {
        throw new Api429Error('Too many OTP requests. Please wait before requesting a new code.');
      }

      // 2. Resolve and validate the recipient
      const recipientType = this._recipientService.getRecipientType(recipientId);
      const recipientValidator = this._recipientValidatorFactory.getValidator(recipientType);
      if (!recipientValidator) {
        throw new Api400Error(`Unsupported recipient type for OTP delivery: ${recipientType}`);
      }
      const user = await recipientValidator.validate(recipientId);
      if (!user) {
        throw new Api400Error('User not found.');
      }

      // 3. Generate, hash, and persist the OTP in Redis (overwrites any stale OTP)
      const plainOtp = OtpGenerator.generateOtp();
      const hashedOtp = await PasswordManager.toHash(plainOtp);

      // 4. Validate all requested channels upfront before dispatching any
      await this._otpRedisRepository.saveOtp(recipientId, hashedOtp);

      // 5. Fan-out to all channels concurrently — one OTP, multiple delivery paths
      const strategies = this._otpDeliveryFactory.getStrategies(types);
      await Promise.all(
        strategies.map((strategy) => strategy.sendOtp(recipientId, plainOtp, user.firstName)),
      );
    } catch (error) {
      logger.error(`Error in service while sending OTP: ${error}`);
      throw error;
    }
  }
}
