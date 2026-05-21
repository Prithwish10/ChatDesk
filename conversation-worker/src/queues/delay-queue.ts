import Queue from 'bull';

const delayQueue = new Queue('delay-queue', {
    redis: {
        host: process.env.REDIS_HOST,
    },
});

export { delayQueue };