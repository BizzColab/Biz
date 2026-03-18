const mongoose = require('mongoose');
const crypto = require('crypto');

const getTenantDB = (tenantId) => {
  if (!tenantId) return null;
  
  // Create a short hash from the tenantId to keep DB name under 38 bytes
  // MongoDB limit: 38 bytes, we use: biz_ (4) + hash (16) = 20 bytes
  const hash = crypto.createHash('md5').update(tenantId).digest('hex').substring(0, 16);
  const dbName = `biz_${hash}`;
  
  const db = mongoose.connection.useDb(dbName, { useCache: true });
  return db;
};

module.exports = { getTenantDB };
