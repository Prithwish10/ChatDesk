import { RecipientType } from '../enums/RecipientType';

export function determineRecipientType(recipientId: string): RecipientType {
  // Regex for validating email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Regex for validating phone number (E.164 format)
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  if (emailRegex.test(recipientId)) {
    return RecipientType.EMAIL;
  } else if (phoneRegex.test(recipientId)) {
    return RecipientType.PHONE;
  } else {
    return RecipientType.INVALID;
  }
}
