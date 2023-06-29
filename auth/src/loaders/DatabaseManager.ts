import mongoose, {
  Connection,
  Model,
  Document,
  ConnectOptions,
} from "mongoose";
import Logger from "./Logger";
import bindModels from "./modelBinder";
const logger = Logger.getInstance();

class DatabaseManager {
  private static instance: DatabaseManager;
  private connection!: Connection;

  /**
   * Private constructor to enforce singleton pattern.
   * @param url - The MongoDB connection URL.
   * @param dbName - The name of the database.
   */
  private constructor(private url: string, private dbName: string) {}

  /**
   * Connect to the MongoDB database.
   * @returns A promise that resolves when the connection is successful.
   * @throws An error if the connection fails.
   */
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
      // Bind the models
      const entities = await bindModels();
      logger.info(`Discovered the following schema entities: ${entities}`);
    } catch (error) {
      logger.error(`Error connecting to the database:, ${error}`);
      throw error;
    }
  }

  /**
   * Disconnect from the MongoDB database.
   */
  disconnect(): void {
    if(this.connection) {
      this.connection.close();
      logger.info(`
      ################################################
      🛡️  Db disconnected successfully !! 🛡️
      ################################################
    `);
    }
  }

  /**
   * Get a Mongoose model for a specific collection.
   * @param modelName - The name of the collection.
   * @returns A Mongoose model for the specified collection.
   */
  getModel<T extends Document>(modelName: string): Model<T> {
    if (!this.connection) {
      throw new Error('Database connection has not been established.');
    }
    return this.connection.model<T>(modelName);
  }

  /**
   * Get an instance of the DatabaseManager class.
   * @param url - The MongoDB connection URL.
   * @param dbName - The name of the database.
   * @returns An instance of the DatabaseManager class.
   */
  static getInstance(url: string, dbName: string): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager(url, dbName);
    }
    return DatabaseManager.instance;
  }
}

export default DatabaseManager;
