const mongoose = require('mongoose');

exports.getData = ({ model, req }) => {
  const Model = req?.models?.[model] || mongoose.model(model);
  const result = Model.find({ removed: false, enabled: true });
  return result;
};

exports.getOne = ({ model, id, req }) => {
  const Model = req?.models?.[model] || mongoose.model(model);
  const result = Model.findOne({ _id: id, removed: false });
  return result;
};
