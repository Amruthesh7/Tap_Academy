import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../../components/common/StatCard';
import { fetchAllRequests, fetchManagerDashboard, fetchPendingRequests } from '../../features/leaveSlice';
import { formatDate } from '../../utils/format';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { FiCheckCircle, FiClock, FiUsers } from 'react-icons/fi';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { managerDashboard } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchManagerDashboard());
    dispatch(fetchPendingRequests());
    dispatch(fetchAllRequests());
  }, [dispatch]);

  const statusSummary = managerDashboard?.statusSummary || { total: 0, pending: 0, approved: 0, rejected: 0 };
  const typeData = (managerDashboard?.byType || []).map((item) => ({
    type: item._id,
    value: item.count,
  }));
  const leaderboard = managerDashboard?.leaderboard || [];
  const recent = managerDashboard?.recent || [];

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Requests"
          value={statusSummary.total}
          delta={`${statusSummary.approved || 0} approved`}
          icon={FiUsers}
        />
        <StatCard
          title="Awaiting action"
          value={statusSummary.pending || 0}
          delta="Pending approvals"
          icon={FiClock}
          tone="secondary"
        />
        <StatCard
          title="Completed"
          value={(statusSummary.approved || 0) + (statusSummary.rejected || 0)}
          delta={`${statusSummary.rejected || 0} rejected`}
          icon={FiCheckCircle}
          tone="accent"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-wide text-slate-400">Requests by type</p>
          {typeData.length ? (
            <div className="mt-6 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <XAxis dataKey="type" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b' }} />
                  <Bar dataKey="value" fill="#f97316" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState title="No activity yet" description="Chart will populate as requests arrive." />
          )}
        </div>

        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
          <p className="text-sm uppercase tracking-wide text-slate-400">Top requesters</p>
          <div className="mt-6 space-y-4">
            {leaderboard.length ? (
              leaderboard.map((item) => (
                <div key={item.userId} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-white">{item.name}</p>
                    <p className="text-xs text-slate-400">Submitted {item.totalRequests} requests</p>
                  </div>
                  <span className="text-2xl font-semibold">{item.totalRequests}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No data yet" description="Leaderboard shows most active teammates." />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6">
        <p className="text-sm uppercase tracking-wide text-slate-400">Recent activity</p>
        <div className="mt-6 space-y-4">
          {recent.length ? (
            recent.map((req) => (
              <div key={req._id} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                <div>
                  <p className="text-white">{req.userId?.name}</p>
                  <p className="text-xs text-slate-400">
                    {req.leaveType.toUpperCase()} • {formatDate(req.startDate)} — {formatDate(req.endDate)}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))
          ) : (
            <EmptyState title="No requests yet" description="Activity feed will populate soon." />
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;


