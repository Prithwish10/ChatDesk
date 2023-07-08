import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scriptAsync = promisify(scrypt);

export class PasswordManager {
  public static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buf = (await scriptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  public static async compare(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buf = (await scriptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}
