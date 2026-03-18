require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });
const { globSync } = require('glob');
const fs = require('fs');
const Joi = require('joi');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const User = require('../models/User');
const { getTenantDB } = require('../utils/dbSwitch');
const { generateOTP, hashOTP, storeOTP, getHashedOTP, deleteOTP } = require('../utils/otpService');
const { sendOTP } = require('../utils/emailService');

const settingSchema = require('../models/schemas/Setting'); 
const paymentModeSchema = require('../models/schemas/PaymentMode');
const taxSchema = require('../models/schemas/Taxes');

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile, gstNumber, country, companyName } = req.body;



    const objectSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email({ tlds: { allow: true } }).required(),
      password: Joi.string().required().min(6),
      mobile: Joi.string().required().min(10),
      gstNumber: Joi.string().optional().allow(''),
    });

    const { error } = objectSchema.validate({ name, email, password, mobile, gstNumber });
    if (error) {
      return res.status(409).json({
        success: false,
        message: 'Invalid credentials.',
        errorMessage: error.message,
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists.',
      });
    }

    const tenantId = crypto.randomUUID();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      mobile,
      tenantId: tenantId,
      companyName: companyName || '',
      gstNumber: gstNumber || '',
      isSetupComplete: false,
    });

    await newUser.save();

    // Generate & Store OTP - Fail gracefully during setup
    let emailSent = true;
    try {
      const otp = generateOTP();
      const hashedOtp = hashOTP(otp);
      await storeOTP(newUser._id.toString(), hashedOtp);
      await sendOTP(newUser.email, otp);
    } catch (otpErr) {
      console.error('OTP/Email Dispatch failed during registration:', otpErr);
      emailSent = false;
    }

    const tenantDB = getTenantDB(tenantId);
    
    // ... rest of the code for setting up tenant ...
    const Setting = tenantDB.model('Setting', settingSchema);
    const Taxes = tenantDB.model('Taxes', taxSchema);
    const PaymentMode = tenantDB.model('PaymentMode', paymentModeSchema);

    const settingData = [];
    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const settingsToUpdate = {
        bizcollab_app_email: email,
        bizcollab_app_company_email: email,
        bizcollab_app_timezone: 'Asia/Kolkata',
        bizcollab_app_country: country || 'IN',
        bizcollab_app_language: 'en_us',
        company_name: companyName || '',
        company_email: email,
        company_phone: mobile,
        company_country: country || 'India',
        company_tax_number: gstNumber || '',
        company_vat_number: gstNumber || '',
        company_reg_number: gstNumber || '',
      };

      const newSettings = file.map((x) => {
        return settingsToUpdate.hasOwnProperty(x.settingKey)
          ? { ...x, settingValue: settingsToUpdate[x.settingKey] }
          : { ...x };
      });

      settingData.push(...newSettings);
    }

    const settingDataWithTenant = settingData.map(s => ({ ...s, tenantId }));
    
    await Setting.insertMany(settingDataWithTenant);
    await Taxes.insertMany([{ taxName: 'Tax 0%', taxValue: 0, isDefault: true, tenantId }]);
    await PaymentMode.insertMany([
      {
        name: 'Cash',
        description: 'Cash on Delivery or Counter Payment',
        isDefault: true,
        enabled: true,
        tenantId,
      },
      {
        name: 'UPI / QR Scan',
        description: 'GPay, PhonePe, Paytm, BHIM',
        isDefault: false,
        enabled: true,
        tenantId,
      },
      {
        name: 'Bank Transfer',
        description: 'NEFT, IMPS, RTGS, Wire Transfer',
        isDefault: false,
        enabled: true,
        tenantId,
      },
      {
        name: 'Cheque',
        description: 'Bank Cheque Clearing',
        isDefault: false,
        enabled: true,
        tenantId,
      },
      {
        name: 'Online Payment',
        description: 'Credit Card / Debit Card / Netbanking',
        isDefault: false,
        enabled: true,
        tenantId,
      },
    ]);

    return res.status(200).json({
      success: true,
      message: emailSent 
        ? 'Account Created. Please verify your email with the OTP sent.'
        : 'Account Created, but verification email could not be sent. Check backend console for OTP or try Resending.',
      result: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isVerified: false,
        tenantId: newUser.tenantId,
        isEmailSent: emailSent
      }
    });

  } catch (err) {
    console.error('--- REGISTRATION SETUP ERROR ---');
    console.error(err);
    console.error('---------------------------------');
    return res.status(500).json({
      success: false,
      message: 'Setup Failed',
      errorMessage: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // --- SECURE 2FA LOGIC: Always send OTP before granting access ---
    let otpSent = true;
    try {
      const otp = generateOTP();
      const hashedOtp = hashOTP(otp);
      await storeOTP(user._id.toString(), hashedOtp);
      await sendOTP(user.email, otp);
    } catch (otpErr) {
      console.error('OTP/Email Dispatch failed during login flow:', otpErr);
      otpSent = false;
    }

    // We never return the token here. We always redirect to OTP verification.
    return res.status(200).json({ 
      success: false, // marked as false so frontend knows it's a multi-step process
      requiresOtp: true,
      message: otpSent
        ? "A verification code has been sent to your email."
        : "Credentials valid, but verification code could not be sent. Please try resending.", 
      result: {
        _id: user._id,
        email: user.email,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ success: false, message: 'User ID and OTP are required' });
    }

    const hashedInputOtp = hashOTP(otp);
    const hashedRedisOtp = await getHashedOTP(userId);

    if (!hashedRedisOtp || hashedInputOtp !== hashedRedisOtp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired code' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Mark as verified
    user.isVerified = true;
    user.enabled = true;
    await user.save();

    // Delete OTP from Redis
    await deleteOTP(userId);

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, tenantId: user.tenantId }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token,
      result: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        isVerified: true,
        isSetupComplete: user.isSetupComplete,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;



    const user = await User.findById(userId);
    if (!user || user.isVerified) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const otp = generateOTP();
    const hashedOtp = hashOTP(otp);
    await storeOTP(userId, hashedOtp);
    await sendOTP(user.email, otp);

    return res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email.'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeSetup = async (req, res) => {
    // ... no changes needed here but I'll make sure it's consistent ...
    try {
        const { companyName, gstNumber, address } = req.body;
        const userId = req.user.id;
    
        if (!companyName || !gstNumber || !address) {
          return res.status(400).json({
            success: false,
            message: 'Company Name, GST Number, and Address are required.',
          });
        }
    
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { 
            companyName, 
            gstNumber, 
            address,
            isSetupComplete: true 
          },
          { new: true }
        );
    
        if (updatedUser) {
          const tenantDB = getTenantDB(updatedUser.tenantId);
          const Setting = tenantDB.model('Setting', settingSchema);
          await Setting.findOneAndUpdate(
            { settingKey: 'company_name', tenantId: updatedUser.tenantId },
            { $set: { settingValue: companyName, settingCategory: 'company_settings' } },
            { upsert: true }
          ).exec();
        }
    
        return res.status(200).json({
          success: true,
          result: updatedUser,
          message: 'Onboarding setup completed successfully!',
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
};

