const mongoose = require('mongoose');

const listAllSettings = async (req) => {
  try {
    const Model = req?.models?.Setting || mongoose.model('Setting');
    //  Query the database for a list of all results
    const result = await Model.find({
      removed: false,
      ...(req.tenantId && { tenantId: req.tenantId }),
    }).exec();

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch {
    return [];
  }
};

module.exports = listAllSettings;
