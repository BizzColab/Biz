const listAllSettings = require('./listAllSettings');

const loadSettings = async (req) => {
  const allSettings = {};
  const datas = await listAllSettings(req);
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });
  return allSettings;
};

module.exports = loadSettings;
