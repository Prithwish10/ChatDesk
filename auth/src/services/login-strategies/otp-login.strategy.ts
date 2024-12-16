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

  async login(user: UserDoc, credential: string): Promise<string> {
    try {
      const storedOtp = await this._otpRepository.getOtp(user.email);
      if (!storedOtp) {
        throw new Api401Error('User not found.');
      }

      const isValidOtp = PasswordManager.compare(credential, storedOtp.hashedOtp);
      if (!isValidOtp) {
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
