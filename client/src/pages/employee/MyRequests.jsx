import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { cancelLeave, fetchMyData } from '../../features/leaveSlice';
import { formatDate } from '../../utils/format';

const MyRequests = () => {
  const dispatch = useDispatch();
  const { myRequests } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchMyData());
  }, [dispatch]);

  const handleCancel = (id) => {
    const confirmed = window.confirm('Cancel this pending request?');
    if (confirmed) {
      dispatch(cancelLeave(id));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">All requests</h2>
      <p className="text-sm text-slate-400">Track every leave request and their current approval state.</p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/5 bg-slate-900/60">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Days</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myRequests.map((request) => (
              <tr key={request._id} className="border-t border-white/5 text-white">
                <td className="px-6 py-4 font-semibold uppercase text-slate-100">{request.leaveType}</td>
                <td className="px-6 py-4 text-slate-300">
                  {formatDate(request.startDate)} — {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4 text-slate-300">{request.totalDays}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={request.status} />
                </td>
                <td className="px-6 py-4">
                  {request.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(request._id)}
                      className="rounded-xl border border-rose-400/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-400/10"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!myRequests.length && (
          <div className="p-8">
            <EmptyState title="No requests yet" description="Submit a request to see it tracked here." />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;


