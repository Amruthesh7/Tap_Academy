import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import dayjs from 'dayjs';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { fetchEmployeeDashboard, fetchMyData } from '../../features/leaveSlice';
import { formatDate } from '../../utils/format';
import { FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';

const EmployeeDashboard = () => {
  const dispatch = useDispatch();
  const { employeeDashboard, balance, myRequests } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
    dispatch(fetchMyData());
  }, [dispatch]);

  const summary = employeeDashboard?.summary || { total: 0, pending: 0, approved: 0, rejected: 0 };
  const upcoming = employeeDashboard?.upcomingLeaves || [];
  const recent = employeeDashboard?.recentRequests || [];

  const chartData = recent
    .slice()
    .reverse()
    .map((req) => ({
      date: dayjs(req.createdAt).format('DD MMM'),
      days: req.totalDays,
    }));

  const balanceEntries = [
    { label: 'Sick', value: balance?.sickLeave || 0 },
    { label: 'Casual', value: balance?.casualLeave || 0 },
    { label: 'Vacation', value: balance?.vacationLeave || 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard title="Total Requests" value={summary.total} delta={`${summary.approved} approved`} icon={FiTrendingUp} />
        <StatCard
          title="Pending"
          value={summary.pending}
          delta="Awaiting manager review"
          icon={FiClock}
          tone="secondary"
        />
        <StatCard
          title="Approved"
          value={summary.approved}
          delta={`${summary.rejected} rejected`}
          icon={FiCheckCircle}
          tone="accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-wide text-slate-400">Recent activity</p>
            <span className="text-xs text-slate-500">Last 7 requests</span>
          </div>
          {chartData.length ? (
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorDays" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                  <Area type="monotone" dataKey="days" stroke="#6366f1" fillOpacity={1} fill="url(#colorDays)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No activity yet" description="Your chart will appear after you create requests." />
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-wide text-slate-400">Leave balance</p>
          <div className="mt-6 space-y-4">
            {balanceEntries.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <p className="text-sm text-slate-300">{item.label}</p>
                <p className="text-xl font-semibold text-white">{item.value} days</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-wide text-slate-400">Upcoming leaves</p>
            <span className="text-xs text-slate-500">Next 3 approvals</span>
          </div>
          <div className="mt-6 space-y-4">
            {upcoming.length ? (
              upcoming.map((item) => (
                <div key={item._id} className="rounded-2xl border border-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-white">{formatDate(item.startDate)}</p>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-400">
                    {item.leaveType.toUpperCase()} • {item.totalDays} days
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{item.reason}</p>
                </div>
              ))
            ) : (
              <EmptyState title="No upcoming leaves" description="Approved requests will show here." />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-wide text-slate-400">Latest requests</p>
          <div className="mt-6 space-y-4">
            {myRequests.slice(0, 5).map((item) => (
              <div key={item._id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-white">{item.leaveType.toUpperCase()}</p>
                  <p className="text-xs text-slate-400">
                    {formatDate(item.startDate)} - {formatDate(item.endDate)}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
            {!myRequests.length && (
              <EmptyState title="No requests yet" description="Create your first request to see it listed here." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;


