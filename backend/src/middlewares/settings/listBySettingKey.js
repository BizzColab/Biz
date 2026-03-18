const mongoose = require('mongoose');

const listBySettingKey = async ({ settingKeyArray = [], req }) => {
  try {
    const Model = req?.models?.Setting || mongoose.model('Setting');
    // Find document by id

    const settingsToShow = { $or: [] };

    if (settingKeyArray.length === 0) {
      return [];
    }

    for (const settingKey of settingKeyArray) {
      settingsToShow.$or.push({ settingKey, ...(req.tenantId && { tenantId: req.tenantId }) });
    }
    let results = await Model.find({ ...settingsToShow }).where('removed', false);

    // If no results found, return document not found
    if (results.length >= 1) {
      return results;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

module.exports = listBySettingKey;
