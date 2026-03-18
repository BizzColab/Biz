const mongoose = require('mongoose');
const { calculate } = require('@/helpers');

class PaymentService {
  /**
   * @param {import('../repositories/paymentRepository')} paymentRepo 
   * @param {import('../repositories/invoiceRepository')} invoiceRepo 
   */
  constructor(paymentRepo, invoiceRepo) {
    this.paymentRepo = paymentRepo;
    this.invoiceRepo = invoiceRepo;
  }

  /**
   * @param {object} paymentData 
   * @param {string} adminId 
   */
  async createPayment(paymentData, adminId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Validate Invoice Availability & Balance
      const currentInvoice = await this.invoiceRepo.findOne({
        _id: paymentData.invoice,
        removed: false
      });

      if (!currentInvoice) {
        throw new Error('Invoice not found or unauthorized');
      }

      const { total, discount, credit } = currentInvoice;
      const maxAmount = calculate.sub(calculate.sub(total, discount), credit);

      if (paymentData.amount > maxAmount + 0.01) { // Tiny buffer for float math
         throw new Error(`The Max Amount you can add is ${maxAmount}`);
      }

      // 2. Prepare Payment Record
      const paymentPayload = {
        ...paymentData,
        createdBy: adminId,
      };

      const result = await this.paymentRepo.create(paymentPayload, session);
      const fileId = `payment-${result._id}.pdf`;
      const updatedPayment = await this.paymentRepo.updatePdf(result._id, fileId, session);

      // 3. Update Invoice State
      const newCredit = calculate.add(credit, paymentData.amount);
      const netTotal = calculate.sub(total, discount);

      let paymentStatus = 
        netTotal <= newCredit ? 'paid' : 
        newCredit > 0 ? 'partially' : 'unpaid';

      await this.invoiceRepo.addPayment(
        currentInvoice._id, 
        result._id, 
        paymentData.amount, 
        paymentStatus, 
        session
      );

      await session.commitTransaction();
      return updatedPayment;

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = PaymentService;
