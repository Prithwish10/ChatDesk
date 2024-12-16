import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { Otp } from '../models/Otp.model';
import { OTPAttrs, OTPDoc } from '../interfaces/Otp';

@Service()
export class OTPRepository {
  constructor() {}

  /**
   * Find otp by user email address.
   * @async
   * @param {string} email - The email address of the user whose otp need to find.
   * @returns {Promise<UserDoc | null>} A Promise that resolves to the found otp object if successful, or null if no otp is found.
   * @throws {Error} Any error that occurs during the database query process.
   */
  public async getOtp(email: string): Promise<OTPDoc | null> {
    try {
      const otp = await Otp.findOne({ email });
      if (!otp || otp.expiration < new Date()) {
        return null;
      }
      return otp;
    } catch (error) {
      logger.error(`Error occured while fetching otp by email: ${error}`);
      throw error;
    }
  }

  public async saveOtp(otp: OTPAttrs): Promise<OTPDoc> {
    try {
      const newOtp = Otp.build(otp);
      const savedOtp = await newOtp.save();

      return savedOtp;
    } catch (error) {
      logger.error(`Error occured while creating otp: ${error}`);
      throw error;
    }
  }
}
