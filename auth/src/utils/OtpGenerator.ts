import * as crypto from 'crypto';

export class OtpGenerator {
  static generateOtp(length: number = 6) {
    return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  }
}
