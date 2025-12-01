const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const bearerToken = req.header('Authorization')?.replace('Bearer ', '');
    const token = req.cookies?.token || bearerToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized' });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user?.role !== 'manager') {
    return res.status(403).json({ message: 'Manager access only' });
  }
  next();
};

module.exports = { auth, managerOnly };


