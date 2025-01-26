import { Service } from 'typedi';
import { RecipientType } from '../enums/RecipientType';
import { UserDoc } from '../interfaces/User';
import { RecipientValidatorFactory } from './RecipientValidatorFactory.service';
import { IRecipientService } from '../interfaces/IRecipientService';
import { determineRecipientType } from '../utils/determine-recipient-type';

@Service()
export class RecipientService implements IRecipientService {
  constructor(private readonly _validatorFactory: RecipientValidatorFactory) {}

  /**
   * Determines the type of recipient based on the input (email or phone).
   * @param recipientId - The recipient identifier.
   * @returns RecipientType - The determined recipient type.
   */
  public getRecipientType(recipientId: string): RecipientType {
    return determineRecipientType(recipientId);
  }

  /**
   * Fetches a user based on the recipient identifier.
   * Automatically determines the recipient type and validates accordingly.
   * @param recipientId - The recipient identifier (email or phone).
   * @returns Promise<UserDocs | null> - The user document or null if not found.
   */
  public async getUserByRecipient(recipientId: string): Promise<UserDoc | null> {
    const recipientType = this.getRecipientType(recipientId);
    const validator = this._validatorFactory.getValidator(recipientType);

    if (!validator) {
      throw new Error(`Unsupported recipient type: ${recipientType}`);
    }

    return validator.validate(recipientId);
  }
}
