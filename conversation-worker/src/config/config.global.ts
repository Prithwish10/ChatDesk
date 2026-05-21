export default {
  servicename: 'conversation-worker',
  redisConsumerName: process.env.POD_NAME || `worker-${Math.random().toString(36).substring(7)}`,
  cronSchedule: process.env.CRON_SCHEDULE || '*/10 * * * *',
  batchSize: process.env.BATCH_SIZE || 1000,

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

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
};
