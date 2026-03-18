require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

async function upgradeApp() {
  try {
    console.log('🚀 Starting Upgrade...');
    // Add logic here if you need to migrate data or add new fields
    
    console.log('✅ Upgrade completed successfully!');
    process.exit();
  } catch (e) {
    console.log('🚫 Error! The Error info is below');
    console.log(e);
    process.exit(1);
  }
}

upgradeApp();
