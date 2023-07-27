import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scriptAsync = promisify(scrypt);

export class PasswordManager {
  /**
   * Hashes a plaintext password with a random salt using a secure hashing algorithm.
   * @static
   * @async
   * @param {string} password - The plaintext password to be hashed.
   * @returns {Promise<string>} A Promise that resolves to the hashed password with the salt appended as a string in the format `${hashedPassword}.${salt}`.
   * @throws {Error} Any error that occurs during the hashing process.
   */
  public static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scriptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  /**
   * Compares a supplied plaintext password with a stored hashed password to verify their match.
   * @static
   * @async
   * @param {string} storedPassword - The stored hashed password in the format `${hashedPassword}.${salt}`.
   * @param {string} suppliedPassword - The plaintext password supplied by a user for comparison.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean value indicating whether the supplied password matches the stored password (true) or not (false).
   * @throws {Error} Any error that occurs during the hashing or comparison process.
   */
  public static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scriptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}
