const mongoose = require('mongoose');

const readBySettingKey = async ({ settingKey, req }) => {
  try {
    const Model = req?.models?.Setting || mongoose.model('Setting');
    // Find document by id

    if (!settingKey) {
      return null;
    }

    const result = await Model.findOne({ 
      settingKey,
      removed: false,
      ...(req.tenantId && { tenantId: req.tenantId }),
    });
    // If no results found, return document not found
    if (!result) {
      return null;
    } else {
      // Return success resposne
      return result;
    }
  } catch {
    return null;
  }
};

module.exports = readBySettingKey;
