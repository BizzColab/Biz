const mongoose = require('mongoose');


const remove = async (req, res) => {
  const Model = req.models.Invoice;
  const ModelPayment = req.models.Payment;
  const deletedInvoice = await Model.findOneAndUpdate(
    {
      _id: req.params.id,
      removed: false,
      ...(req.tenantId && { tenantId: req.tenantId }),
    },
    {
      $set: {
        removed: true,
      },
    }
  ).exec();

  if (!deletedInvoice) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Invoice not found',
    });
  }
  const paymentsInvoices = await ModelPayment.updateMany(
    { 
      invoice: deletedInvoice._id,
      ...(req.tenantId && { tenantId: req.tenantId }), 
    },
    { $set: { removed: true } }
  );
  return res.status(200).json({
    success: true,
    result: deletedInvoice,
    message: 'Invoice deleted successfully',
  });
};

module.exports = remove;
