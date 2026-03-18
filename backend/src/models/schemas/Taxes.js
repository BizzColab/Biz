const mongoose = require('mongoose');

const taxSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  tenantId: { 
    type: String, 
    required: true, 
    index: true 
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  taxName: {
    type: String,
    required: true,
  },
  taxValue: {
    type: Number,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = taxSchema;
