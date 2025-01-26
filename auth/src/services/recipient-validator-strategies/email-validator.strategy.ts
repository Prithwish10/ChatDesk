import { Service } from 'typedi';
import { UserDoc } from '../../interfaces/User';
import { UserRepository } from '../../repositories/user.repository';
import { IRecipientValidatorStrategy } from './IRecipientValidator.strategy';
import { logger } from '../../loaders/logger';

@Service()
export class EmailValidatorStrategy implements IRecipientValidatorStrategy {
  constructor(private readonly _userRepository: UserRepository) {}

  /**
   * Validates a recipientId by searching for a user with the same email in the database.
   * @param recipientId - The recipientId to validate.
   * @returns A Promise that resolves to the user object if found, or null if not found.
   * @throws An error if something goes wrong during the validation process.
   */
  public async validate(recipientId: string): Promise<UserDoc | null> {
    try {
      const user = await this._userRepository.findUserByEmail(recipientId);
      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by email: ${error}`);
      throw error;
    }
  }
}
