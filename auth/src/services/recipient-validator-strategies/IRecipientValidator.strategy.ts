import { UserDoc } from '../../interfaces/User';

export interface IRecipientValidatorStrategy {
  validate(recipientId: string): Promise<UserDoc | null>;
}
