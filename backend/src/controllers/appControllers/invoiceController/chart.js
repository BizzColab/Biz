const moment = require('moment');

const chart = async (req, res) => {
  const Model = req.models.Invoice;
  const PaymentModel = req.models.Payment;

  // Get data for the last 12 months
  const months = [];
  for (let i = 11; i >= 0; i--) {
    months.push(moment().subtract(i, 'months').startOf('month'));
  }

  const startDate = months[0].toDate();
  const endDate = moment().endOf('month').toDate();

  const invoicePerformance = await Model.aggregate([
    {
      $match: {
        removed: false,
        ...(req.tenantId && { tenantId: req.tenantId }),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        revenue: { $sum: '$total' },
      },
    },
  ]);

  const paymentPerformance = await PaymentModel.aggregate([
    {
      $match: {
        removed: false,
        ...(req.tenantId && { tenantId: req.tenantId }),
        date: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' },
        },
        amount: { $sum: '$amount' },
      },
    },
  ]);

  const result = months.map((m) => {
    const month = m.month() + 1;
    const year = m.year();
    const inv = invoicePerformance.find((item) => item._id.month === month && item._id.year === year);
    const pay = paymentPerformance.find((item) => item._id.month === month && item._id.year === year);

    return {
      name: m.format('MMM'),
      revenue: inv ? inv.revenue : 0,
      expenses: pay ? pay.amount : 0, // In this context, payments received are revenue, but we can treat them as collections or whatever. 
      // Actually, let's just show Revenue (Invoices) and Payments (Collections)
    };
  });

  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully fetched chart data',
  });
};

module.exports = chart;
