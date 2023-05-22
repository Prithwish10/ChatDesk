import mongoose, { Connection, Model, Document, ConnectOptions } from "mongoose";
import Logger from "./Logger";
const logger = Logger.getInstance('DatabaseManager');

class DatabaseManager {
  private static instance: DatabaseManager;
  private connection!: Connection;

  private constructor(private url: string, private dbName: string) {}

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.url, {
        dbName: this.dbName,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as ConnectOptions);

      this.connection = mongoose.connection;
      logger.info(`
      ################################################
      🛡️  Db connected successfully !! 🛡️
      ################################################
    `);
    } catch (error) {
        logger.error(`Error connecting to the database:, error`);
        throw error;
    }
  }

  disconnect(): void {
    mongoose.disconnect();
    logger.info('Disconnected from the database');
  }

  getModel<T extends Document>(modelName: string): Model<T> {
    return this.connection.model<T>(modelName);
  }

  static getInstance(url: string, dbName: string): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(url, dbName);
    }
    return DatabaseManager.instance;
  }
}

export default DatabaseManager;
