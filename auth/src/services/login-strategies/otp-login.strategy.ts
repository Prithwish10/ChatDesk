import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { Api401Error, Api429Error } from '@pdchat/common';
import { UserDoc } from '../../interfaces/User';
import { OTPRedisRepository } from '../../repositories/otp-redis.repository';
import { ILoginStrategy } from './login.strategy';
import { PasswordManager } from '../PasswordManager.service';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

@Service()
export class OTPLoginStrategy implements ILoginStrategy {
  constructor(private readonly _otpRedisRepository: OTPRedisRepository) {}
  async login(user: UserDoc, credential: string, recipientId: string): Promise<string> {
    try {
      const storedOtp = await this._otpRedisRepository.getOtp(recipientId);
      if (!storedOtp) {
        throw new Api401Error('Invalid or expired OTP.');
      }

      // Guard: too many failed attempts — delete the OTP to force re-request
      if (storedOtp.attempts >= config.otp.maxAttempts) {
        await this._otpRedisRepository.deleteOtp(recipientId);
        throw new Api429Error('Maximum verification attempts exceeded. Please request a new OTP.');
      }

      // Atomically record this attempt before comparing
      await this._otpRedisRepository.incrementAttempts(recipientId); // Fix: PasswordManager.compare() is async — must be awaited
      const isValidOtp = await PasswordManager.compare(storedOtp.hash, credential);
      if (!isValidOtp) {
        throw new Api401Error('Invalid OTP.');
      }

      // Invalidate the OTP immediately after a successful match (prevent replay)
      await this._otpRedisRepository.deleteOtp(recipientId);
      const userJwt = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
        config.jwtSecret!,
      );
      return userJwt;
    } catch (error) {
      logger.error(`Error occurred while logging in via OTP: ${error}`);
      throw error;
    }
  }
}
