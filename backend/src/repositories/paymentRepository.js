const BaseRepository = require('./baseRepository');

class PaymentRepository extends BaseRepository {
  /**
   * @param {import('mongoose').Model} model 
   * @param {string} tenantId 
   */
  constructor(model, tenantId) {
    super(model, tenantId);
  }

  /**
   * @param {string} id 
   * @param {string} pdfName 
   * @param {import('mongoose').ClientSession} [session]
   */
  async updatePdf(id, pdfName, session = null) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId: this.tenantId, removed: false },
      { pdf: pdfName },
      { new: true, session }
    ).exec();
  }
}

module.exports = PaymentRepository;
