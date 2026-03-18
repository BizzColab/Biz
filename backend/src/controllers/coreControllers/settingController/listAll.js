const mongoose = require('mongoose');
const listAll = async (req, res) => {
  const Model = req.models?.Setting || mongoose.model('Setting');
  const sort = parseInt(req.query.sort) || 'desc';

  //  Query the database for a list of all results
  const result = await Model.find({
    removed: false,
    isPrivate: false,
    ...(req.tenantId && { tenantId: req.tenantId }),
  }).sort({ created: sort });

  return res.status(200).json({
    success: true,
    result: result || [],
    message: result.length > 0 ? 'Successfully found all documents' : 'Collection is Empty',
  });

};

module.exports = listAll;
