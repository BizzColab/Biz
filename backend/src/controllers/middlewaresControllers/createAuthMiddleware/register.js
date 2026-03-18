const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password, name, surname } = req.body;

  // Validation
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    surname: Joi.string().allow(''),
  });

  const { error, value } = objectSchema.validate({ email, password, name, surname });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: 'Invalid/Missing credentials.',
      errorMessage: error.message,
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email: email.toLowerCase(), removed: false });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  try {
    // Create new user
    const user = await new UserModel({
      email: email.toLowerCase(),
      name: name,
      surname: surname || '',
      enabled: true,
      role: 'owner',
    }).save();

    // Generate salt and hash password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(salt + password);

    // Create password entry
    await new UserPasswordModel({
      user: user._id,
      password: hashedPassword,
      salt: salt,
      emailVerified: true,
    }).save();

    // Return success without auto-login (user needs to login manually)
    return res.status(200).json({
      success: true,
      result: {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
      },
      message: 'Account created successfully. Please login with your credentials.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Registration failed',
      error: error.message,
    });
  }
};

module.exports = register;
