const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Taxes');

delete methods['delete'];

methods.create = async (req, res) => {
  const Model = req.models.Taxes;
  const { isDefault } = req.body;

  if (isDefault) {
    await Model.updateMany({ 
      ...(req.tenantId && { tenantId: req.tenantId }) 
    }, { isDefault: false });
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
    ...(req.tenantId && { tenantId: req.tenantId }),
  });

  const result = await new Model({
    ...req.body,
    ...(req.tenantId && { tenantId: req.tenantId }), // Inject tenantId here if not in body
    isDefault: countDefault < 1 ? true : false,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'Tax created successfully',
  });
};

methods.delete = async (req, res) => {
  return res.status(403).json({
    success: false,
    result: null,
    message: "you can't delete tax after it has been created",
  });
};

methods.update = async (req, res) => {
  const Model = req.models.Taxes;
  const { id } = req.params;
  const tax = await Model.findOne({
    _id: req.params.id,
    removed: false,
    ...(req.tenantId && { tenantId: req.tenantId }),
  }).exec();

  if (!tax) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  }

  const { isDefault = tax.isDefault, enabled = tax.enabled } = req.body;

  // if isDefault:false , we update first - isDefault:true
  // if enabled:false and isDefault:true , we update first - isDefault:true
  if (!isDefault || (!enabled && isDefault)) {
    await Model.findOneAndUpdate({ _id: { $ne: id }, enabled: true, ...(req.tenantId && { tenantId: req.tenantId }) }, { isDefault: true });
  }

  // if isDefault:true and enabled:true, we update other taxes and make is isDefault:false
  if (isDefault && enabled) {
    await Model.updateMany({ _id: { $ne: id }, ...(req.tenantId && { tenantId: req.tenantId }) }, { isDefault: false });
  }

  const taxesCount = await Model.countDocuments({ 
    ...(req.tenantId && { tenantId: req.tenantId }) 
  });

  // if enabled:false and it's only one exist, we can't disable
  if ((!enabled || !isDefault) && taxesCount <= 1) {
    return res.status(422).json({
      success: false,
      result: null,
      message: 'You cannot disable the tax because it is the only existing one',
    });
  }

  // Ensure consistency: if we calculated a new isDefault state, we must update it
  if (!req.body.hasOwnProperty('isDefault')) {
    req.body.isDefault = isDefault;
  }

  const result = await Model.findOneAndUpdate({ _id: id, ...(req.tenantId && { tenantId: req.tenantId }) }, req.body, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: 'Tax updated successfully',
    result,
  });
};

module.exports = methods;
