import { Service } from 'typedi';
import { UserDoc } from '../../interfaces/User';
import { logger } from '../../loaders/logger';
import { UserRepository } from '../../repositories/user.repository';
import { IRecipientValidatorStrategy } from './IRecipientValidator.strategy';
import { parseMobileNumber } from '../../utils/mobile-number-parser';
import { Api400Error } from '@pdchat/common';

@Service()
export class PhoneValidatorStrategy implements IRecipientValidatorStrategy {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Validates a recipientId by searching for a user with the same mobile number in the database.
   * @param recipientId - The recipientId to validate, in the format +[countryCode][nationalNumber].
   * @returns A Promise that resolves to the user object if found, or null if not found.
   * @throws An error if something goes wrong during the validation process.
   */
  public async validate(recipientId: string): Promise<UserDoc | null> {
    try {
      const { countryCode, nationalNumber } = parseMobileNumber(recipientId);
      logger.info(
        `Validating phone number: ${recipientId}, parsed as country code ${countryCode} and national number ${nationalNumber}`,
      );
      if (!countryCode || !nationalNumber) {
        throw new Api400Error('Invalid phone number format.');
      }
      const user = await this._userRepository.findUserByMobileNumber(countryCode, nationalNumber);
      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by email: ${error}`);
      throw error;
    }
  }
}
