import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import { logger } from "./loaders/logger";
import DatabaseManager from "./loaders/DatabaseManager";
import config from "./config/config.global";
import ChatServer from "./socket/ChatServer";

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private readonly _dbConnection: DatabaseManager;
  private server!: http.Server;
  private _chatServer: ChatServer;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number, dbConnection: any) {
    this._app = express();
    this._port = port;
    this._dbConnection = dbConnection;
    this.configureMiddlewaresAndRoutes(this._app);
  }

  /**
   * Configures the middlewares and routes for the server's Express application.
   * @param app - The Express application object.
   */
  private async configureMiddlewaresAndRoutes(app: Application): Promise<void> {
    await require("./loaders/express").default({ app });
  }

  private configureSocketServer(): void {
    this._chatServer = new ChatServer(
      this.server,
      parseInt(config.socket.pingTimeout as string),
      config.socket.corsOrigin
    );
    this._chatServer.configureSocketEvents();
  }

  /**
   * Starts the server by listening on the specified port and establishing a database connection.
   * Logs a message indicating that the server is running.
   * Throws an error if an error occurs during server startup.
   */
  public up(): void {
    try {
      this.server = this._app
        .listen(this._port, async () => {
          logger.info(`
        ################################################
        🛡️  Server listening on port: ${this._port} 🛡️
        ################################################
      `);
          // Connect to the database
          await this._dbConnection.connect();
        })
        .on("error", (err) => {
          logger.error(`${err}`);
          process.exit(1);
        });

      this.configureSocketServer();
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
    if (this._dbConnection && this.server) {
      await Promise.all([this.server.close(), this._dbConnection.disconnect()]);

      logger.info(`
        ################################################
        🛡️  All services are shutdown!! 🛡️
        ################################################
      `);
    }
  }
}

export default Server;
