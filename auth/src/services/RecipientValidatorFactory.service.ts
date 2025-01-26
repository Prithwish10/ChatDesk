import { Service } from 'typedi';
import { EmailValidatorStrategy } from './recipient-validator-strategies/email-validator.strategy';
import { PhoneValidatorStrategy } from './recipient-validator-strategies/phone-validator.strategy';
import { RecipientType } from '../enums/RecipientType';
import { IRecipientValidatorStrategy } from './recipient-validator-strategies/IRecipientValidator.strategy';

@Service()
export class RecipientValidatorFactory {
  constructor(
    private readonly _emailValidator: EmailValidatorStrategy,
    private readonly _phoneValidator: PhoneValidatorStrategy,
  ) {}

  /**
   * Retrieves the appropriate validator based on recipient type.
   * @param recipientType - The recipient type (email or phone).
   * @returns IRecipientValidator - The appropriate validator.
   */
  public getValidator(recipientType: RecipientType): IRecipientValidatorStrategy | null {
    switch (recipientType) {
      case RecipientType.EMAIL:
        return this._emailValidator;
      case RecipientType.PHONE:
        return this._phoneValidator;
      default:
        return null;
    }
  }
}
