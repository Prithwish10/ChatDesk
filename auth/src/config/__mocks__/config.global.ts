process.env.JWT_KEY = "asdfabcd";
process.env.MONGO_URL = "asdf";
process.env.DB_NAME = "asdf";
process.env.NATS_URL = "asdf";
process.env.NATS_CLUSTER_ID = "asdf";
process.env.NATS_CLUSTER_ID = "asdf";

export default {
  jwtSecret: process.env.JWT_KEY,

  api: {
    prefix: process.env.API_PREFIX || "/api",
    version: process.env.API_VERSION || "/v1",
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
};
