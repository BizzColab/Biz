const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  // Identity
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String, required: true },
  tenantId: { type: String, default: () => crypto.randomUUID(), required: true, unique: true, index: true }, // The Key to their DB
  
  // Onboarding Status
  isSetupComplete: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  
  // Business Info
  companyName: { type: String, default: '' },
  gstNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  
  // UI & Access
  photo: { type: String, trim: true },
  role: { type: String, default: 'owner', enum: ['superadmin', 'owner', 'admin', 'manager', 'employee', 'create_only', 'read_only'] },
  enabled: { type: Boolean, default: true },
  removed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
