const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config({ path: 'backend/.env' });

async function testConnection() {
  try {
    const dbUri = process.env.DATABASE;
    if (!dbUri) throw new Error("DATABASE URI is missing");
    
    await mongoose.connect(dbUri, { dbName: 'BizCollab_core' });
    console.log('Connected to BizCollab_core');
    
    const tenantId = uuidv4();
    const dbName = `biz_test_${tenantId.substring(0, 8)}`;
    console.log(`Switching to ${dbName}`);
    
    const tenantDB = mongoose.connection.useDb(dbName);
    const TestModel = tenantDB.model('Test', new mongoose.Schema({ name: String }));
    
    await TestModel.create({ name: 'Testing Tenant DB' });
    console.log('Successfully created document in tenant DB');
    
    await tenantDB.dropDatabase();
    console.log('Successfully dropped test tenant DB');
    
    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (err) {
    console.error('Test Failed:', err);
  }
}

testConnection();
