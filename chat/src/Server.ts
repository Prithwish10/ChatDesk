import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import { logger } from "./loaders/logger";
import DatabaseManager from "./loaders/DatabaseManager";
import config from "./config/config.global";
import ChatServer from "./socket/ChatServer";
import { natsWrapper } from "./loaders/NatsWrapper";
import { UserCreatedListener } from "./events/listeners/user-created-listener";
import { UserUpdatedListener } from "./events/listeners/user-updated-listener";
import CacheManager from "./services/CacheManager.service";

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port: number;
  private readonly _dbConnection: DatabaseManager;
  private server!: http.Server;
  private _chatServer: ChatServer;
  private _cacheManager: CacheManager;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number, dbConnection: any, cacheManager: CacheManager) {
    this._app = express();
    this._port = port;
    this._dbConnection = dbConnection;
    this._cacheManager = cacheManager;
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
      config.socketOptions,
      this._cacheManager
    );
    this._chatServer.configureSocketEvents();
  }

  /**
   * Starts the server by listening on the specified port and establishing a database connection.
   * Logs a message indicating that the server is running.
   * Throws an error if an error occurs during server startup.
   */
  public async up(): Promise<void> {
    try {
      await natsWrapper.connect(
        config.connections.nats.natsClusterId!,
        config.connections.nats.natsClientId!,
        config.connections.nats.natsURL!
      );

      natsWrapper.client.on("close", () => {
        logger.info("NATS connection closed!");
        process.exit();
      });
      process.on("SIGINT", () => natsWrapper.client.close());
      process.on("SIGTERM", () => natsWrapper.client.close());

      new UserCreatedListener(natsWrapper.client).listen();
      new UserUpdatedListener(natsWrapper.client).listen();

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

      this.bindPOSIXSignals();
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
    const promises = [];
    if (this._dbConnection) {
      promises.push(this._dbConnection.disconnect());
    }

    if (this.server) {
      promises.push(this.server.close());
      logger.info(`
        ################################################
        🛡️  Server shutdown!! 🛡️
        ################################################
      `);
    }

    if (this._cacheManager) {
      promises.push(this._cacheManager.quit());
    }

    await Promise.all(promises);
  };

  private bindPOSIXSignals() {
    process.on("SIGINT", async () => this.shutdown());
    process.on("SIGTERM", async () => this.shutdown());
  }
}

export default Server;
