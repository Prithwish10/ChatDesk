import { Api400Error } from '@pdchat/common';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Parses a mobile number and returns the country code and the number.
 *
 * @param mobileNumber - The input mobile number in string format.
 * @returns An object containing the `countryCode` and `nationalNumber`, or an error if invalid.
 */
export function parseMobileNumber(mobileNumber: string): {
  countryCode: string;
  nationalNumber: string;
} {
  try {
    const phoneNumber = parsePhoneNumberFromString(mobileNumber);

    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new Api400Error('Invalid mobile number');
    }

    return {
      countryCode: `+${phoneNumber.countryCallingCode}`,
      nationalNumber: phoneNumber.nationalNumber,
    };
  } catch (error) {
    throw new Error(`Error parsing mobile number: ${error}`);
  }
}
