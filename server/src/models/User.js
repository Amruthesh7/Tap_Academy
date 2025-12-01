const mongoose = require('mongoose');

const leaveBalanceSchema = new mongoose.Schema(
  {
    sickLeave: { type: Number, default: 10 },
    casualLeave: { type: Number, default: 5 },
    vacationLeave: { type: Number, default: 5 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['employee', 'manager'], default: 'employee' },
    leaveBalance: { type: leaveBalanceSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);


