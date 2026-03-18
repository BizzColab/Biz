const create = async (Model, req, res) => {
  // Creating a new document in the collection
  req.body.removed = false;
  
  // Inject Tenant ID Automaticallly
  if (req.tenantId) {
    req.body.tenantId = req.tenantId;
  }
  const result = await new Model({
    ...req.body,
  }).save();

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result,
    message: 'Successfully Created the document in Model ',
  });
};

module.exports = create;
