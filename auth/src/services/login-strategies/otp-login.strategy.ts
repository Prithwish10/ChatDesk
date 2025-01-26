import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { Api401Error } from '@pdchat/common';
import { UserDoc } from '../../interfaces/User';
import { OTPRepository } from '../../repositories/otp.repository';
import { ILoginStrategy } from './login.strategy';
import { PasswordManager } from '../PasswordManager.service';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

@Service()
export class OTPLoginStrategy implements ILoginStrategy {
  constructor(private readonly _otpRepository: OTPRepository) {}

  async login(user: UserDoc, credential: string, recipientId: string): Promise<string> {
    try {
      console.log(recipientId);
      const storedOtp = await this._otpRepository.getOtp(recipientId);
      if (!storedOtp) {
        throw new Api401Error('Invalid OTP.');
      }

      const isValidOtp = PasswordManager.compare(storedOtp.hashedOtp, credential);
      const currentDate = new Date();
      if (!isValidOtp || currentDate > storedOtp.expiration) {
        throw new Api401Error('Invalid or expired otp.');
      }

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
      logger.error(`Error occured while login via OTP: ${error}`);
      throw error;
    }
  }
}
