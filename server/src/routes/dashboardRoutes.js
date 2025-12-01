const express = require('express');
const { employeeDashboard, managerDashboard } = require('../controllers/dashboardController');
const { auth, managerOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/employee', auth, employeeDashboard);
router.get('/manager', auth, managerOnly, managerDashboard);

module.exports = router;


