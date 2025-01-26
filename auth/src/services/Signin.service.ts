import { Service } from 'typedi';
import { Api400Error, Api401Error } from '@pdchat/common';
import { logger } from '../loaders/logger';
import { UserAttrs } from '../interfaces/User';
import { LoginStrategyFactory } from './LoginStrategyFactory.service';
import { LoginType } from '../enums/LoginType';
import { RecipientType } from '../enums/RecipientType';
import { RecipientService } from './Recipient.service';

@Service()
export class SigninService {
  constructor(
    private readonly _loginFactory: LoginStrategyFactory,
    private readonly _recipientService: RecipientService,
  ) {}

  /**
   * Authenticates a user by their email and password, generating a JSON Web Token (JWT) upon successful authentication.
   * @async
   * @param {LoginType} loginType - The type of login user wants to login with.
   * @param {string} recipientId - The email address or the phone number of the user attempting to sign in.
   * @param {string} credential - The plaintext password or the OTP provided by the user for the login.
   * @returns {Promise<{ user: UserAttrs, userJwt: string }>} A Promise that resolves to an object containing the authenticated user and their corresponding JWT (JSON Web Token) after successful signin.
   * @throws {Api400Error} If the recipientId is invalid (e.g. not a valid email or phone number).
   * @throws {Api401Error} If the credentials are invalid.
   * @throws {Error} Any other error that occurs during the signin process.
   */
  public async signin(
    loginType: LoginType,
    recipientId: string,
    credential: string,
  ): Promise<{ user: UserAttrs; userJwt: string }> {
    try {
      const recipientType = this._recipientService.getRecipientType(recipientId);
      if (recipientType === RecipientType.INVALID) {
        throw new Api400Error('Invalid email or phone number format.');
      }

      const user = await this._recipientService.getUserByRecipient(recipientId);
      if (!user) {
        throw new Api401Error('Invalid credentials.');
      }
      const loginStrategy = this._loginFactory.getStrategy(loginType);
      const userJwt = await loginStrategy.login(user, credential, recipientId);

      return { user, userJwt };
    } catch (error) {
      logger.error(`Error in service while fetching conversation by Id: ${error}`);
      throw error;
    }
  }
}
