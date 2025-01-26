import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { Api400Error } from '@pdchat/common';
import { UserDoc } from '../../interfaces/User';
import { PasswordManager } from '../PasswordManager.service';
import { ILoginStrategy } from './login.strategy';
import config from '../../config/config.global';
import { logger } from '../../loaders/logger';

@Service()
export class UsernamePasswordLoginStrategy implements ILoginStrategy {
  async login(user: UserDoc, credential: string): Promise<string> {
    try {
      const passwordMatch = await PasswordManager.compare(user.password, credential);
      if (!passwordMatch) {
        throw new Api400Error('Invalid credentials.');
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
      logger.error(`Error in password login strategy: ${error}`);
      throw error;
    }
  }
}
