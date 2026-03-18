/**
 * @typedef {import('mongoose').Model} Model
 * @typedef {import('mongoose').ClientSession} ClientSession
 */

class BaseRepository {
  /**
   * @param {Model} model - Mongoose Model
   * @param {string} tenantId - Tenant ID
   */
  constructor(model, tenantId) {
    if (!model) throw new Error('Model is required for Repository');
    if (!tenantId) throw new Error('TenantID is required for Repository');
    this.model = model;
    this.tenantId = tenantId;
  }

  /**
   * @param {object} query 
   * @returns {Promise<any>}
   */
  async findOne(query) {
    return this.model.findOne({ ...query, tenantId: this.tenantId });
  }

  /**
   * @param {object} data 
   * @param {ClientSession} [session]
   */
  async create(data, session = null) {
    const doc = new this.model({ ...data, tenantId: this.tenantId });
    return doc.save({ session });
  }

  /**
   * @param {string} id 
   * @param {object} updateData 
   * @param {ClientSession} [session]
   */
  async findByIdAndUpdate(id, updateData, session = null) {
    return this.model.findOneAndUpdate(
      { _id: id, tenantId: this.tenantId },
      updateData,
      { new: true, session }
    );
  }

  /**
   * @param {object} filter 
   */
  async find(filter = {}) {
    return this.model.find({ ...filter, tenantId: this.tenantId });
  }

  /**
   * @param {string} id 
   * @param {ClientSession} [session]
   */
  async deleteById(id, session = null) {
    return this.model.findOneAndDelete(
      { _id: id, tenantId: this.tenantId },
      { session }
    );
  }
}

module.exports = BaseRepository;
