const mongoose = require('mongoose');

const updateManySetting = async (req, res) => {
  const Model = req.models?.Setting || mongoose.model('Setting');
  // req/body = [{settingKey:"",settingValue}]
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings, settingCategory } = req.body;

  for (const setting of settings) {
    if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
      settingsHasError = true;
      break;
    }

    const { settingKey, settingValue } = setting;

    updateDataArray.push({
      updateOne: {
        filter: { settingKey: settingKey, ...(req.tenantId && { tenantId: req.tenantId }) },
        update: {
          $set: {
            settingValue: settingValue,
            ...(settingCategory && { settingCategory }),
            ...(req.tenantId && { tenantId: req.tenantId }),
          },
        },
        upsert: true,
      },
    });
  }


  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided ',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }
  const companyNameSetting = settings.find((s) => s.settingKey === 'company_name');
  if (companyNameSetting && req.tenantId) {
    const User = mongoose.model('User');
    await User.findOneAndUpdate(
      { tenantId: req.tenantId, removed: false },
      { $set: { companyName: companyNameSetting.settingValue } }
    ).exec();
  }

  const result = await Model.bulkWrite(updateDataArray);

  if (!result || result.nMatched < 1) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No settings found by to update',
    });
  } else {
    return res.status(200).json({
      success: true,
      result: [],
      message: 'we update all settings',
    });
  }
};

module.exports = updateManySetting;
