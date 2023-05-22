import winston from "winston";
import config from "../config/index";

class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor(moduleName: string) {
    this.logger = winston.createLogger({
      level: config.logs.level,
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${moduleName}] ${level}: ${message}`;
        }),
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

  public static getInstance(moduleName: string) {
    if(!Logger.instance) {
        Logger.instance = new Logger(moduleName);
    }

    return Logger.instance;
  }

  public error(message: string): void {
    this.logger.error(message);
  }

  public warn(message: string): void {
    this.logger.warn(message);
  }

  public info(message: string): void {
    this.logger.info(message);
  }

  public debug(message: string): void {
    this.logger.debug(message);
  }

  public silly(message: string): void {
    this.logger.silly(message);
  }
}

export default Logger;
