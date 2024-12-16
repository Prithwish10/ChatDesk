import { Service } from 'typedi';
import { Api401Error } from '@pdchat/common';
import { logger } from '../loaders/logger';
import { UserRepository } from '../repositories/user.repository';
import { UserAttrs } from '../interfaces/User';
import { LoginStrategyFactory } from './LoginStrategyFactory.service';
import { LoginType } from '../enums/LoginType';

@Service()
export class SigninService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _loginStrategyFactory: LoginStrategyFactory,
  ) {}

  /**
   * Authenticates a user by their email and password, generating a JSON Web Token (JWT) upon successful authentication.
   * @async
   * @param {LoginType} type - The type of login.
   * @param {string} email - The email address of the user attempting to sign in.
   * @param {string} password - The plaintext password provided by the user for authentication.
   * @returns {Promise<{ user: UserAttrs, userJwt: string }>} A Promise that resolves to an object containing the authenticated user and their corresponding JWT (JSON Web Token).
   * @throws {Api401Error} If the provided credentials are invalid (email not found or password does not match).
   * @throws {Error} Any other error that occurs during the authentication process.
   */
  public async signin(
    type: LoginType,
    email: string,
    password: string,
  ): Promise<{ user: UserAttrs; userJwt: string }> {
    try {
      const user = await this._userRepository.findUserByEmail(email);
      if (!user) {
        throw new Api401Error('Invalid credentials.');
      }

      const loginStrategy = this._loginStrategyFactory.getStrategy(type);
      const userJwt = await loginStrategy.login(user, password);

      return { user, userJwt };
    } catch (error) {
      logger.error(`Error in service while fetching conversation by Id: ${error}`);
      throw error;
    }
  }
}
