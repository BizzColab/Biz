require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Ensure you have installed: npm install bcryptjs

// --- 1. Import The New Schemas & Models ---
const settingSchema = require('../models/schemas/Setting');
const User = require('../models/User'); // We use the NEW User model, not "Admin"

async function setupApp() {
  try {
    // --- 2. Database Connection ---
    // Ensure your .env has MONGO_URI pointing to 'bizcollab_core'
    const dbUri = process.env.MONGO_URI || process.env.DATABASE;
    
    if (!dbUri) {
        throw new Error("❌ MONGO_URI is missing in .env file");
    }

    await mongoose.connect(dbUri);
    console.log('📡 Connected to Core MongoDB');

    // --- 3. Compile the Global Settings Model ---
    // This allows us to save "System-Wide" settings in the Core DB
    const Setting = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

    // Load defaults (Ensure this file exists in your project)
    const setupConfig = require('./setupConfig.json'); 

    console.log('🚀 Starting System Setup...');

    // --- 4. Create The Super Admin (SaaS Owner) ---
    const adminEmail = 'admin@bizcollab.com'; // Use a professional email
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      // Hash the password manually since we are bypassing the controller
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const newAdmin = new User({
        name: 'BizCollab Super Admin',
        email: adminEmail,
        password: hashedPassword,
        mobile: '0000000000',
        companyName: 'BizCollab HQ',
        
        // CRITICAL: Special ID for the Owner
        tenantId: 'system-core', 
        role: 'superadmin',
        isSetupComplete: true 
      });

      await newAdmin.save();
      console.log(`👍 Super Admin created!`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Pass:  admin123`);
    } else {
      console.log('ℹ️ Super Admin already exists');
    }

    // --- 5. Initialize Global Core Settings ---
    const count = await Setting.countDocuments();
    if (count === 0 && setupConfig) {
      const settingsData = setupConfig.map(s => ({
        settingCategory: s.setupCategory,
        settingKey: s.setupKey,
        settingValue: s.setupValue,
        valueType: s.valueType,
        isCoreSetting: true // Mark these as Global
      }));
      
      await Setting.insertMany(settingsData);
      console.log('👍 Default Core Settings created');
    } else {
      console.log('ℹ️ Core Settings already exist');
    }

    console.log('✅ Setup completed successfully!');
    process.exit();

  } catch (e) {
    console.log('🚫 Error! The Error info is below');
    console.error(e);
    process.exit(1);
  }
}

setupApp();