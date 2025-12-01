const express = require('express');
const {
  applyLeave,
  getMyRequests,
  getMyBalance,
  cancelLeave,
  getAllRequests,
  getPendingRequests,
  approveLeave,
  rejectLeave,
} = require('../controllers/leaveController');
const { auth, managerOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, applyLeave);
router.get('/my-requests', auth, getMyRequests);
router.get('/balance', auth, getMyBalance);
router.delete('/:id', auth, cancelLeave);

router.get('/all', auth, managerOnly, getAllRequests);
router.get('/pending', auth, managerOnly, getPendingRequests);
router.put('/:id/approve', auth, managerOnly, approveLeave);
router.put('/:id/reject', auth, managerOnly, rejectLeave);

module.exports = router;


