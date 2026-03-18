const mongoose = require('mongoose');

const custom = require('@/controllers/pdfController');

const { calculate } = require('@/helpers');

const update = async (req, res) => {
  const Model = req.models.Payment;
  const Invoice = req.models.Invoice;
  const tenantId = req.tenantId;

  if (req.body.amount === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Minimum Amount couldn't be 0`,
    });
  }
  // Find document by id and updates with the required fields
  const previousPayment = await Model.findOne({
    _id: req.params.id,
    removed: false,
    ...(tenantId && { tenantId }),
  }).populate('invoice');

  if (!previousPayment) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'Payment not found',
    });
  }

  const { amount: previousAmount } = previousPayment;
  const { _id: invoiceId, total, discount, credit: previousCredit } = previousPayment.invoice;

  const { amount: currentAmount } = req.body;

  const changedAmount = calculate.sub(currentAmount, previousAmount);
  const maxAmount = calculate.add(calculate.sub(total, calculate.add(discount, previousCredit)), previousAmount);

  if (currentAmount > maxAmount) {
    return res.status(202).json({
      success: false,
      result: null,
      message: `The Max Amount you can add is ${maxAmount}`,
    });
  }

  let paymentStatus =
    calculate.sub(total, discount) === calculate.add(previousCredit, changedAmount)
      ? 'paid'
      : calculate.add(previousCredit, changedAmount) > 0
      ? 'partially'
      : 'unpaid';

  const updatedDate = new Date();
  const updates = {
    number: req.body.number,
    date: req.body.date,
    amount: req.body.amount,
    paymentMode: req.body.paymentMode,
    ref: req.body.ref,
    description: req.body.description,
    updated: updatedDate,
  };

  const result = await Model.findOneAndUpdate(
    { _id: req.params.id, removed: false, ...(tenantId && { tenantId }) },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  const updateInvoice = await Invoice.findOneAndUpdate(
    { _id: invoiceId },
    {
      $inc: { credit: changedAmount },
      $set: {
        paymentStatus: paymentStatus,
      },
    },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully updated the Payment ',
  });
};

module.exports = update;
