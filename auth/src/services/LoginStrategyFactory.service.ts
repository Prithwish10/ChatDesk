import { Service } from 'typedi';
import { LoginType } from '../enums/LoginType';
import { ILoginStrategy } from './login-strategies/login.strategy';
import { OTPLoginStrategy } from './login-strategies/otp-login.strategy';
import { UsernamePasswordLoginStrategy } from './login-strategies/username-password-login.strategy';
import { Api400Error } from '@pdchat/common';

@Service()
export class LoginStrategyFactory {
  constructor(
    private readonly _usernamePasswordStrategy: UsernamePasswordLoginStrategy,
    private readonly _otpLoginStrategy: OTPLoginStrategy,
  ) {}

  getStrategy(type: string): ILoginStrategy {
    switch (type) {
      case LoginType.USERNAME_PASSWORD:
        return this._usernamePasswordStrategy;
      case LoginType.OTP:
        return this._otpLoginStrategy;
      default:
        throw new Api400Error('Invalid login type');
    }
  }
}
