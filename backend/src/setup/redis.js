const { createClient } = require('redis');

let redisClient = null;

const initRedis = async () => {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: false // Do not retry connection if it fails
      }
    });

    client.on('error', (err) => {
      // Suppress unhandled errors to avoid backend loop crashes
    });

    await client.connect();
    console.log('Connected to Redis');
    redisClient = client;
  } catch (err) {
    console.warn('Redis connection failed, disabling backend caching. Run Redis locally to enable.');
    redisClient = null;
  }
};

const getRedisClient = () => redisClient;

module.exports = { initRedis, getRedisClient };
