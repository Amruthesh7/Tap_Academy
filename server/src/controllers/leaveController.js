const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');
const calculateTotalDays = require('../utils/calculateTotalDays');

const ensureBalance = (user, leaveType, totalDays) => {
  const balanceKey =
    leaveType === 'sick' ? 'sickLeave' : leaveType === 'casual' ? 'casualLeave' : 'vacationLeave';

  if (user.leaveBalance[balanceKey] < totalDays) {
    throw new Error(`Not enough ${leaveType} leave balance`);
  }

  user.leaveBalance[balanceKey] -= totalDays;
};

const refundBalance = (user, leaveType, totalDays) => {
  const balanceKey =
    leaveType === 'sick' ? 'sickLeave' : leaveType === 'casual' ? 'casualLeave' : 'vacationLeave';

  user.leaveBalance[balanceKey] += totalDays;
};

exports.applyLeave = async (req, res, next) => {
  try {
    const { leaveType, startDate, endDate, reason } = req.body;

    if (!leaveType || !startDate || !endDate || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const validTypes = ['sick', 'casual', 'vacation'];
    if (!validTypes.includes(leaveType)) {
      return res.status(400).json({ message: 'Invalid leave type' });
    }

    const totalDays = calculateTotalDays(startDate, endDate);

    const user = await User.findById(req.user._id);
    ensureBalance(user, leaveType, totalDays);
    await user.save();

    const leaveRequest = await LeaveRequest.create({
      userId: req.user._id,
      leaveType,
      startDate,
      endDate,
      totalDays,
      reason,
    });

    res.status(201).json(leaveRequest);
  } catch (error) {
    if (error.message.startsWith('Not enough') || error.message.includes('Invalid')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
};

exports.getMyRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

exports.getMyBalance = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('leaveBalance');
    res.json(user.leaveBalance);
  } catch (error) {
    next(error);
  }
};

exports.cancelLeave = async (req, res, next) => {
  try {
    const leave = await LeaveRequest.findOne({ _id: req.params.id, userId: req.user._id });
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    const user = await User.findById(req.user._id);
    refundBalance(user, leave.leaveType, leave.totalDays);
    await user.save();

    leave.status = 'cancelled';
    await leave.save();

    res.json({ message: 'Leave request cancelled' });
  } catch (error) {
    next(error);
  }
};

exports.getAllRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find().sort({ createdAt: -1 }).populate('userId', 'name role');
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

exports.getPendingRequests = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'name role');
    res.json(requests);
  } catch (error) {
    next(error);
  }
};

const updateLeaveStatus = async (req, res, next, status) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be actioned' });
    }

    leave.status = status;
    leave.managerComment = req.body.managerComment || '';
    await leave.save();

    if (status === 'rejected') {
      const user = await User.findById(leave.userId);
      refundBalance(user, leave.leaveType, leave.totalDays);
      await user.save();
    }

    res.json(leave);
  } catch (error) {
    next(error);
  }
};

exports.approveLeave = (req, res, next) => updateLeaveStatus(req, res, next, 'approved');
exports.rejectLeave = (req, res, next) => updateLeaveStatus(req, res, next, 'rejected');


