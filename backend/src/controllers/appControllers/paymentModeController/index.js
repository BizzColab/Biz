const mongoose = require('mongoose');
const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('PaymentMode');

delete methods['delete'];

methods.create = async (req, res) => {
  const Model = req.models.PaymentMode;
  const { isDefault } = req.body;

  if (isDefault) {
    await Model.updateMany(
      { ...(req.tenantId && { tenantId: req.tenantId }) },
      { isDefault: false }
    );
  }

  const countDefault = await Model.countDocuments({
    isDefault: true,
    ...(req.tenantId && { tenantId: req.tenantId }),
  });

  const result = await new Model({
    ...req.body,
    ...(req.tenantId && { tenantId: req.tenantId }), // ✅ Inject tenantId
    isDefault: countDefault < 1 ? true : false,
  }).save();

  return res.status(200).json({
    success: true,
    result: result,
    message: 'payment mode created successfully',
  });
};

methods.delete = async (req, res) => {
  return res.status(403).json({
    success: false,
    result: null,
    message: "you can't delete payment mode after it has been created",
  });
};

methods.update = async (req, res) => {
  const Model = req.models.PaymentMode;
  const { id } = req.params;
  const tenantId = req.tenantId;

  const paymentMode = await Model.findOne({
    _id: id,
    removed: false,
    ...(tenantId && { tenantId }),
  }).exec();

  if (!paymentMode) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Payment mode not found',
    });
  }

  const { isDefault = paymentMode.isDefault, enabled = paymentMode.enabled } = req.body;

  // if isDefault:false , we update first - isDefault:true
  // if enabled:false and isDefault:true , we update first - isDefault:true
  if (!isDefault || (!enabled && isDefault)) {
    await Model.findOneAndUpdate(
      { _id: { $ne: id }, enabled: true, ...(tenantId && { tenantId }) },
      { isDefault: true }
    );
  }

  // if isDefault:true and enabled:true, we update other paymentMode and make is isDefault:false
  if (isDefault && enabled) {
    await Model.updateMany(
      { _id: { $ne: id }, ...(tenantId && { tenantId }) },
      { isDefault: false }
    );
  }

  const paymentModeCount = await Model.countDocuments({
    ...(tenantId && { tenantId }),
    removed: false,
  });

  // if enabled:false and it's only one exist, we can't disable
  if ((!enabled || !isDefault) && paymentModeCount <= 1) {
    return res.status(422).json({
      success: false,
      result: null,
      message: 'You cannot disable the paymentMode because it is the only existing one',
    });
  }

  const result = await Model.findOneAndUpdate(
    { _id: id, ...(tenantId && { tenantId }) },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).exec();

  return res.status(200).json({
    success: true,
    message: 'paymentMode updated successfully',
    result,
  });
};

module.exports = methods;
