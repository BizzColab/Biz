
exports.createClient = async (req, res) => {
  try {
    const { name, email, phone, address, country } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email, and Phone are required.',
      });
    }

    if (!req.tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Tenant ID is missing.',
      });
    }

    const Client = req.models.Client;

    const newClient = new Client({
      name,
      email,
      phone,
      address,
      country,
      tenantId: req.tenantId, // ✅ Always inject tenantId
    });

    const result = await newClient.save();

    return res.status(201).json({
      success: true,
      result,
      message: 'Client created successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getClients = async (req, res) => {
  try {
    if (!req.tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Tenant ID is missing.',
      });
    }

    const Client = req.models.Client;
    // ✅ Always scope queries to the current tenant
    const result = await Client.find({ removed: false, tenantId: req.tenantId });

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully retrieved clients.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, country } = req.body;

    if (!req.tenantId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: Tenant ID is missing.',
      });
    }

    const Client = req.models.Client;
    
    const result = await Client.findOneAndUpdate(
      { _id: id, tenantId: req.tenantId, removed: false },
      { name, email, phone, address, country },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Client not found.',
      });
    }

    return res.status(200).json({
      success: true,
      result,
      message: 'Client updated successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
