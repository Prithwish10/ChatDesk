import config from "./config/index";
import DatabaseManager from "./loaders/DatabaseManager";
import Server from "./Server";

// Run the services with default configuration
exports.default = new Server(
  Number.parseInt(config.port as string),
  DatabaseManager.getInstance(
    config.connections.mongodb.databaseURL as string,
    config.connections.mongodb.databaseName as string
  )
).up();
