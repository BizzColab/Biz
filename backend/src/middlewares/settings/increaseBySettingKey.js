const mongoose = require('mongoose');

const increaseBySettingKey = async ({ settingKey, req }) => {
  try {
    if (!settingKey) {
      return null;
    }

    const Model = req?.models?.Setting || mongoose.model('Setting');

    const result = await Model.findOneAndUpdate(
      { settingKey, ...(req.tenantId && { tenantId: req.tenantId }) },
      {
        $inc: { settingValue: 1 },
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

module.exports = increaseBySettingKey;
