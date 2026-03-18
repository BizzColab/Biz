const BaseRepository = require('./baseRepository');

class InvoiceRepository extends BaseRepository {
  /**
   * @param {import('mongoose').Model} model 
   * @param {string} tenantId 
   */
  constructor(model, tenantId) {
    super(model, tenantId);
  }

  /**
   * @param {string} id 
   * @param {string} paymentId 
   * @param {number} amount 
   * @param {string} status 
   * @param {import('mongoose').ClientSession} [session]
   */
  async addPayment(id, paymentId, amount, status, session = null) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId: this.tenantId, removed: false },
      {
        $push: { payment: paymentId },
        $inc: { credit: amount },
        $set: { paymentStatus: status },
      },
      { new: true, runValidators: true, session }
    ).exec();
  }
}

module.exports = InvoiceRepository;
