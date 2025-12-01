const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

exports.employeeDashboard = async (req, res, next) => {
  try {
    const requests = await LeaveRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });

    const summary = requests.reduce(
      (acc, request) => {
        acc.total += 1;
        acc[request.status] = (acc[request.status] || 0) + 1;
        return acc;
      },
      { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 }
    );

    const upcomingLeaves = requests
      .filter((reqItem) => reqItem.status === 'approved' && new Date(reqItem.startDate) >= new Date())
      .slice(0, 3);

    res.json({
      summary,
      leaveBalance: req.user.leaveBalance,
      recentRequests: requests.slice(0, 5),
      upcomingLeaves,
    });
  } catch (error) {
    next(error);
  }
};

exports.managerDashboard = async (req, res, next) => {
  try {
    const stats = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusSummary = stats.reduce(
      (acc, curr) => ({ ...acc, [curr._id]: curr.count }),
      { pending: 0, approved: 0, rejected: 0, cancelled: 0 }
    );
    statusSummary.total = stats.reduce((sum, item) => sum + item.count, 0);

    const byType = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$leaveType',
          count: { $sum: 1 },
        },
      },
    ]);

    const topEmployees = await LeaveRequest.aggregate([
      {
        $group: {
          _id: '$userId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const userIds = topEmployees.map((emp) => emp._id);
    const users = await User.find({ _id: { $in: userIds } }).select('name role');
    const leaderboard = topEmployees.map((entry) => {
      const user = users.find((u) => u._id.equals(entry._id));
      return { userId: entry._id, name: user?.name || 'Unknown', totalRequests: entry.count };
    });

    const recent = await LeaveRequest.find().sort({ createdAt: -1 }).limit(5).populate('userId', 'name role');

    res.json({
      statusSummary,
      byType,
      leaderboard,
      recent,
    });
  } catch (error) {
    next(error);
  }
};


