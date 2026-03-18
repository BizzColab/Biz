const mongoose = require('mongoose');

const updateBySettingKey = async ({ settingKey, settingValue, req }) => {
  try {
    const Model = req?.models?.Setting || mongoose.model('Setting');
    if (!settingKey || !settingValue) {
      return null;
    }

    const result = await Model.findOneAndUpdate(
      { settingKey, ...(req.tenantId && { tenantId: req.tenantId }) },
      {
        settingValue,
        ...(req.tenantId && { tenantId: req.tenantId }),
      },
      {
        new: true, // return the new result instead of the old one
        runValidators: true,
      }
    ).exec();
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

module.exports = updateBySettingKey;
