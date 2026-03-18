const useDate = ({ settings }) => {
  const { bizcollab_app_date_format } = settings;

  const dateFormat = bizcollab_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;

