import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import DatabaseManager from "./loaders/DatabaseManager";

import Logger from "./loaders/Logger";
const logger = Logger.getInstance();

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private app: Application;
  private port: number;
  private dbConnection: DatabaseManager;
  private server!: http.Server;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number, dbConnection: any) {
    this.app = express();
    this.port = port;
    this.dbConnection = dbConnection;
    this.configureMiddlewaresAndRoutes(this.app);
  }

  /**
   * Configures the middlewares and routes for the server's Express application.
   * @param app - The Express application object.
   */
  private async configureMiddlewaresAndRoutes(app: Application): Promise<void> {
    await require("./loaders/express").default({ app });
  }

  /**
   * Starts the server by listening on the specified port and establishing a database connection.
   * Logs a message indicating that the server is running.
   * Throws an error if an error occurs during server startup.
   */
  public up(): void {
    try {
      this.server = this.app
        .listen(this.port, async () => {
          logger.info(`
        ################################################
        🛡️  Server listening on port: ${this.port} 🛡️
        ################################################
      `);
          // Connect to the database
          await this.dbConnection.connect();
        })
        .on("error", (err) => {
          logger.error(`${err}`);
          process.exit(1);
        });
    } catch (error: any) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Gracefully shuts down the server by closing the server and database connections.
   * Logs a message indicating that all services are shutdown.
   */
  public async shutdown(): Promise<void> {
    if (this.server && this.dbConnection) {
      await Promise.all([this.server.close(), this.dbConnection.disconnect()]);

      logger.info(`
        ################################################
        🛡️  All services are shutdown!! 🛡️
        ################################################
      `);
    }
  }
}

export default Server;
