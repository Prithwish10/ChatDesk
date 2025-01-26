import { Service } from 'typedi';
import { logger } from '../loaders/logger';
import { User } from '../models/User.model';
import { UserAttrs, UserDoc } from '../interfaces/User';

@Service()
export class UserRepository {
  constructor() {}

  /**
   * Finds a user by their email address.
   * @async
   * @param {string} email - The email address of the user to find.
   * @returns {Promise<UserDoc | null>} A Promise that resolves to the found user object if successful, or null if no user is found.
   * @throws {Error} Any error that occurs during the database query process.
   */
  public async findUserByEmail(email: string): Promise<UserDoc | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by email: ${error}`);
      throw error;
    }
  }

  /**
   * Finds a user by their mobile number.
   * @async
   * @param {string} mobileNumber - The mobile number of the user to find.
   * @returns {Promise<UserDoc | null>} A Promise that resolves to the found user object if successful, or null if no user is found.
   * @throws {Error} Any error that occurs during the database query process.
   */
  public async findUserByMobileNumber(
    countryCode: string,
    mobileNumber: string,
  ): Promise<UserDoc | null> {
    try {
      const user = await User.findOne({ countryCode: countryCode, mobileNumber: mobileNumber });
      return user;
    } catch (error) {
      logger.error(`Error occured while fetching user by mobile number: ${error}`);
      throw error;
    }
  }

  /**
   * Creates a new user in the database.
   * @async
   * @param {UserAttrs} user - An object representing the user to be created, with properties like `email`, `mobileNumber`, and any other required fields.
   * @returns {Promise<UserDoc>} A Promise that resolves to the newly created user object if successful.
   * @throws {Error} Any error that occurs during the database creation process.
   */
  public async createUser(user: UserAttrs): Promise<UserDoc> {
    try {
      const newUser = User.build(user);
      const savedUser = await newUser.save();

      return savedUser;
    } catch (error) {
      logger.error(`Error occured while creating user: ${error}`);
      throw error;
    }
  }
}
