import config from "./config/config.global";
import DatabaseManager from "./loaders/DatabaseManager";
import Server from "./Server";
import CacheManager from "./services/CacheManager.service";

// Run the services with default configuration
const server = new Server(
  Number.parseInt(config.port as string),
  DatabaseManager.getInstance(
    config.connections.mongodb.databaseURL as string,
    config.connections.mongodb.databaseName as string
  ),
  CacheManager.getInstance(config.connections.redisOptions)
);
server.up();

export default server;
