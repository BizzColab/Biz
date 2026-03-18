const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const tenantMiddleware = require('../middlewares/tenantMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/create', authMiddleware, tenantMiddleware, clientController.createClient);
router.get('/list', authMiddleware, tenantMiddleware, clientController.getClients);

module.exports = router;
