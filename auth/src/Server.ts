import "reflect-metadata";
import express, { Application } from "express";
import http from "http";
import DatabaseManager from "./loaders/DatabaseManager";
import { logger } from "./loaders/logger";
import config from "./config/config.global";
import { natsWrapper } from "./loaders/NatsWrapper";

/**
 * Represents a server that listens on a specified port and handles HTTP requests.
 */
class Server {
  private readonly _app: Application;
  private readonly _port?: number;
  private readonly _dbConnection: DatabaseManager;
  private _server!: http.Server;

  /**
   * Creates a new Server instance.
   * @param port - The port number on which the server will listen.
   * @param dbConnection - The database connection object.
   */
  constructor(port: number | undefined, dbConnection: any) {
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
  
  /**
   * Starts the server by establishing connections and setting up event listeners.
   *
   * @throws {Error} Throws an error if there is an issue during the startup process.
   *
   * @returns {Promise<Application | void>} Resolves when the server is successfully started.
   */
  public async up(): Promise<Application | void> {
    try {
      // This condition is intended for testing purposes, allowing dynamic port binding for Supertest.
      if (!this._port) {
        return this._app;
      } else {
        await natsWrapper.connect(
          config.connections.nats.natsClusterId!,
          config.connections.nats.natsClientId!,
          config.connections.nats.natsURL!
        );

        natsWrapper.client.on("close", () => {
          logger.info("⛔ NATS connection closed! ⛔");
          process.exit();
        });
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        this._server = this._app
          .listen(this._port, async () => {
            logger.info(`
        ################################################
        🛡️  Server listening on port: ${this._port} 🛡️
        ################################################
      `);
            await this._dbConnection.connect();
          })
          .on("error", (err) => {
            logger.error(`${err}`);
            process.exit(1);
          });
      }
      this.bindPOSIXSignals();
    } catch (error: any) {
      logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * Gracefully shuts down the server by closing the server and database connections.
   * Logs a message indicating that all services are shutdown.
   *
   * @returns {Promise<void>} Resolves when the server is successfully stopped.
   */
  public async shutdown(): Promise<void> {
    try {
      const promises = [];

      if (this._server) {
        promises.push(
          new Promise<void>((resolve, reject) => {
            this._server.close((err?: Error) => {
              if (err) {
                logger.error(
                  `Error while closing server: ${err.message} :error`
                );
                reject(err);
              } else {
                logger.info(`
                ################################################
                ⛔  Server shutdown!! ⛔
                ################################################
              `);
              }
              resolve();
            });
          })
        );
      }

      if (this._dbConnection) {
        promises.push(this._dbConnection.disconnect());
        logger.info("⛔ Database connection closed. ⛔");
      }

      await Promise.all(promises);
      logger.info("⛔ Shutdown process completed. ⛔");
      process.exit(0);
    } catch (error) {
      logger.error(`Error during shutdown process: ${error}`);
      process.exit(1);
      // throw new Error("Failed to complete shutdown process.");
    }
  }

  /**
   * Binds POSIX signals (SIGINT and SIGTERM) to trigger the graceful shutdown process.
   * When either SIGINT or SIGTERM is received, the `shutdown` method is called.
   */
  private bindPOSIXSignals() {
    process.on("SIGINT", async () => this.shutdown());
    process.on("SIGTERM", async () => this.shutdown());
  }
}

export default Server;
