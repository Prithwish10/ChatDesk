import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import DatabaseManager from "./loaders/DatabaseManager";
import { Logger } from "@pdchat/common";
import config from "./config/config.global";

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private readonly _dbConnection: DatabaseManager;
  private _server!: http.Server;
  private readonly _logger: Logger;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number, dbConnection: any) {
    this._app = express();
    this._port = port;
    this._dbConnection = dbConnection;
    this._logger = Logger.getInstance(config.servicename);
    this.configureMiddlewaresAndRoutes(this._app);
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
      this._server = this._app
        .listen(this._port, async () => {
          this._logger.info(`
        ################################################
        🛡️  Server listening on port: ${this._port} 🛡️
        ################################################
      `);
          // Connect to the database
          await this._dbConnection.connect();
        })
        .on("error", (err) => {
          this._logger.error(`${err}`);
          process.exit(1);
        });
    } catch (error: any) {
      this._logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Gracefully shuts down the server by closing the server and database connections.
   * Logs a message indicating that all services are shutdown.
   */
  public async shutdown(): Promise<void> {
    if (this._server && this._dbConnection) {
      await Promise.all([this._server.close(), this._dbConnection.disconnect()]);

      this._logger.info(`
        ################################################
        🛡️  All services are shutdown!! 🛡️
        ################################################
      `);
    }
  }
}

export default Server;
