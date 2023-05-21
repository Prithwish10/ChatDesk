import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if(envFound.error) {
    throw new Error("Couldn't find .env file");
}

export default {
    port: process.env.PORT || 8000,

    /**
     * Database connection
     */
    connections: {
        mongodb: {
            databaseURL: process.env.MONGO_URL
        }
    },

    SecretKey: process.env.SECRET_KEY,
    jwtSecret: process.env.JWT_SECRET,

    /**
     * API configs
     */
    api: {
        prefix: "/api"
    },

    /**
     * Used by winston logger
     */
     logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
}