export default {
  servicename: 'conversation',
  port: process.env.PORT || 3000,
  cronSchedule: process.env.CRON_SCHEDULE || '*/10 * * * *',

  /**
   * Connection parameters
   */
  connections: {
    mongodb: {
      databaseURL: process.env.MONGO_URL,
      databaseName: process.env.DB_NAME,
    },
    redisOptions: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    },
    nats: {
      natsURL: process.env.NATS_URL,
      natsClusterId: process.env.NATS_CLUSTER_ID,
      natsClientId: process.env.NATS_CLIENT_ID,
    },
  },

  jwtSecret: process.env.JWT_KEY,

  /**
   * API configs
   */
  api: {
    prefix: process.env.API_PREFIX || '/api',
    version: process.env.API_VERSION || '/v1',
  },

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};
