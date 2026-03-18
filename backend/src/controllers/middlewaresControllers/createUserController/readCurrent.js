const mongoose = require('mongoose');

const readCurrent = async (userModel, req, res) => {
  try {
    const User = mongoose.model('User');
    const userId = req.user._id;

    let result = await User.findById(userId).exec();

    // Fallback to Admin model if not found in User (for legacy accounts)
    if (!result) {
      try {
        const Admin = mongoose.model('Admin');
        result = await Admin.findById(userId).exec();
      } catch (e) {
        // Admin model might not be registered or lookup failed
      }
    }

    if (!result || result.removed) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No user found with current token',
      });
    }

    return res.status(200).json({
      success: true,
      result: {
        _id: result._id,
        enabled: result.enabled,
        email: result.email,
        name: result.name,
        mobile: result.mobile || result.phone || 'N/A', // Support both field names
        companyName: result.companyName || 'N/A',
        gstNumber: result.gstNumber || 'Not Provided',
        photo: result.photo,
        role: result.role || 'owner',
      },
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    console.error('Info Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error retrieving profile',
    });
  }
};

module.exports = readCurrent;
