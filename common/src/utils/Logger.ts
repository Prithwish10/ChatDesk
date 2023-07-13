import winston from "winston";
import config from "../config/config.global";

export class Logger {
  private static instances: { [moduleName: string]: Logger } = {};
  private logger: winston.Logger;
  private serviceName: string;

  /**
   * Private constructor of the Logger class.
   * @param serviceName The name of the module or component.
   */
  private constructor(serviceName: string) {
    this.serviceName = serviceName;

    this.logger = winston.createLogger({
      level: config.logs.level,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${serviceName}] ${level}: ${message}`;
        })
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: "logs/error.log",
          level: "error",
        }),
        new winston.transports.File({ filename: "logs/combined.log" }),
      ],
    });
  }

  /**
   * Retrieves the singleton instance of the Logger class.
   * If the instance doesn't exist, it creates a new instance.
   * @param serviceName The name of the module or component.
   * @returns The Logger instance.
   */
  public static getInstance(serviceName: string) {
    if (!Logger.instances[serviceName]) {
      Logger.instances[serviceName] = new Logger(serviceName);
    }

    return Logger.instances[serviceName];
  }

  /**
   * Logs an error message.
   * @param message The error message to be logged.
   */
  public error(message: string): void {
    this.logger.error(message);
  }

  /**
   * Logs a warning message.
   * @param message The warning message to be logged.
   */
  public warn(message: string): void {
    this.logger.warn(message);
  }

  /**
   * Logs an information message.
   * @param message The information message to be logged.
   */
  public info(message: string): void {
    this.logger.info(message);
  }

  /**
   * Logs a debug message.
   * @param message The debug message to be logged.
   */
  public debug(message: string): void {
    this.logger.debug(message);
  }

  /**
   * Logs a silly message.
   * @param message The debug message to be logged.
   */
  public silly(message: string): void {
    this.logger.silly(message);
  }
}
