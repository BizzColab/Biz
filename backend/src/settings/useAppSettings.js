const useAppSettings = () => {
  let settings = {};
  settings['bizcollab_app_email'] = 'noreply@bizcollabapp.com';
  settings['bizcollab_base_url'] = 'https://cloud.bizcollabapp.com';
  return settings;
};

module.exports = useAppSettings;

