import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import {
  approveLeaveRequest,
  fetchPendingRequests,
  rejectLeaveRequest,
} from '../../features/leaveSlice';
import { formatDate } from '../../utils/format';

const PendingRequests = () => {
  const dispatch = useDispatch();
  const pending = useSelector((state) => state.leaves.manager.pending);

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleAction = (id, action) => {
    const managerComment = window.prompt('Add optional comment for the employee', '');
    if (action === 'approve') {
      dispatch(approveLeaveRequest({ id, managerComment }));
    } else {
      dispatch(rejectLeaveRequest({ id, managerComment }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Pending approvals</h2>
      <p className="text-sm text-slate-400">Review waiting requests and share quick feedback.</p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/5 bg-slate-900/60">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((request) => (
              <tr key={request._id} className="border-t border-white/5 text-white">
                <td className="px-6 py-4">
                  <p className="font-semibold">{request.userId?.name}</p>
                  <p className="text-xs text-slate-400">{request.userId?.role}</p>
                </td>
                <td className="px-6 py-4 uppercase">{request.leaveType}</td>
                <td className="px-6 py-4 text-slate-300">
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4 space-x-3">
                  <button
                    onClick={() => handleAction(request._id, 'approve')}
                    className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(request._id, 'reject')}
                    className="rounded-xl bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!pending.length && (
          <div className="p-8">
            <EmptyState title="Nothing pending" description="You're all caught up!" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingRequests;


