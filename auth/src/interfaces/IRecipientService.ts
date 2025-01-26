import { RecipientType } from '../enums/RecipientType';
import { UserAttrs } from './User';

export interface IRecipientService {
  getRecipientType(recipientId: string): RecipientType;
  getUserByRecipient(recipientId: string): Promise<UserAttrs | null>;
}
