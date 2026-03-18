const { getTenantDB } = require('../utils/dbSwitch');

const ClientSchema = require('../models/schemas/Client');
const InvoiceSchema = require('../models/schemas/Invoice');
const QuoteSchema = require('../models/schemas/Quote');
const PaymentSchema = require('../models/schemas/Payment');
const PaymentModeSchema = require('../models/schemas/PaymentMode');
const TaxSchema = require('../models/schemas/Taxes');
const SettingSchema = require('../models/schemas/Setting');

const tenantMiddleware = (req, res, next) => {
  const user = req.user || req.admin; 

  if (!user || !user.tenantId) {
    return res.status(401).json({ success: false, message: "No Tenant ID found" });
  }

  req.tenantId = user.tenantId;

  const tenantDB = getTenantDB(user.tenantId);
  
  if (!tenantDB) {
    return res.status(500).json({ success: false, message: "Database switching failed" });
  }

  req.models = {
    Client: tenantDB.model('Client', ClientSchema),
    Invoice: tenantDB.model('Invoice', InvoiceSchema),
    Quote: tenantDB.model('Quote', QuoteSchema),
    Payment: tenantDB.model('Payment', PaymentSchema),
    PaymentMode: tenantDB.model('PaymentMode', PaymentModeSchema),
    Taxes: tenantDB.model('Taxes', TaxSchema),
    Setting: tenantDB.model('Setting', SettingSchema),
  };

  next();
};

module.exports = tenantMiddleware;
