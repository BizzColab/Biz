const { catchAsync } = require('@/handlers/errorHandlers');
const PaymentRepository = require('@/repositories/paymentRepository');
const InvoiceRepository = require('@/repositories/invoiceRepository');
const PaymentService = require('@/services/paymentService');
const schema = require('./schemaValidate');

/**
 * Handle new payment creation with CSR Architecture
 */
const create = catchAsync(async (req, res) => {
  const { models, tenantId, admin, body } = req;

  // 1. Validation First
  const { error } = schema.validate(body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  // 2. Repository & Service Initialization
  // Each request gets its own thin instance with the correct tenant context
  const paymentRepo = new PaymentRepository(models.Payment, tenantId);
  const invoiceRepo = new InvoiceRepository(models.Invoice, tenantId);
  const paymentService = new PaymentService(paymentRepo, invoiceRepo);

  // 3. Orchestrate Atomic Business Transaction
  const result = await paymentService.createPayment(body, admin._id);

  // 4. Uniform JSON Response
  return res.status(200).json({
    success: true,
    result,
    message: 'Payment recorded and ledger updated successfully',
  });
});

module.exports = create;
