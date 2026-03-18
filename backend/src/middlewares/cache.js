const { getRedisClient } = require('@/setup/redis');

const cacheMiddleware = async (req, res, next) => {
  const redisClient = getRedisClient();
  
  if (!redisClient || !redisClient.isReady) {
    return next();
  }

  const tenantId = req.tenantId || 'global';
  // Example cache key: tenant_123:summary:/api/invoice/summary?type=month
  const cacheKey = `${tenantId}:metrics:${req.originalUrl}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
  } catch (err) {
    console.error('Redis Get Error:', err);
  }

  // Intercept the res.json method to cache the response
  const originalJson = res.json.bind(res);
  
  res.json = (body) => {
    // Only cache successful requests
    if (body && body.success) {
      redisClient.setEx(cacheKey, 900, JSON.stringify(body)).catch((err) => {
        console.error('Redis SetEx Error:', err);
      });
    }
    return originalJson(body);
  };

  next();
};

const clearCacheMiddleware = async (req, res, next) => {
  const redisClient = getRedisClient();
  if (redisClient && redisClient.isReady) {
    try {
      const tenantId = req.tenantId || 'global';
      // Clear all keys for this tenant starting with tenantId:metrics
      const keys = await redisClient.keys(`${tenantId}:metrics:*`);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error('Redis Clear Cache Error:', err);
    }
  }
  next();
};

module.exports = { cacheMiddleware, clearCacheMiddleware };
