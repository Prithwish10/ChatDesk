import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { Otp } from '../models/Otp.model';
import { OTPAttrs, OTPDoc } from '../interfaces/Otp';

@Service()
export class OTPRepository {
  constructor() {}

  /**
   * Find otp by recipientId.
   * @async
   * @param {string} recipientId - The email address of the user whose otp need to find.
   * @returns {Promise<UserDoc | null>} A Promise that resolves to the found otp object if successful, or null if no otp is found.
   * @throws {Error} Any error that occurs during the database query process.
   */
  public async getOtp(recipientId: string): Promise<OTPDoc | null> {
    try {
      const otp = await Otp.findOne({ recipientId }).sort('-createdAt').limit(1);
      if (!otp || otp.expiration < new Date()) {
        return null;
      }
      return otp;
    } catch (error) {
      logger.error(`Error occured while fetching otp by email: ${error}`);
      throw error;
    }
  }

  /**
   * Create a new OTP document in the database.
   * @async
   * @param {OTPAttrs} otp - The attributes of the OTP to be saved.
   * @returns {Promise<OTPDoc>} A Promise that resolves to the newly created OTP document object.
   * @throws {Error} Any error that occurs during the database query process.
   */
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
