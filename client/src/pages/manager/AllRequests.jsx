import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { fetchAllRequests } from '../../features/leaveSlice';
import { formatDate } from '../../utils/format';

const AllRequests = () => {
  const dispatch = useDispatch();
  const allRequests = useSelector((state) => state.leaves.manager.all);

  useEffect(() => {
    dispatch(fetchAllRequests());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Team history</h2>
      <p className="text-sm text-slate-400">Every request from every employee – searchable archive.</p>

      <div className="mt-8 overflow-x-auto rounded-3xl border border-white/5 bg-slate-900/60">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Type</th>
              <th className="px-6 py-4 font-medium">Dates</th>
              <th className="px-6 py-4 font-medium">Days</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {allRequests.map((request) => (
              <tr key={request._id} className="border-t border-white/5 text-white">
                <td className="px-6 py-4">
                  <p className="font-semibold">{request.userId?.name}</p>
                  <p className="text-xs text-slate-400">{request.userId?.role}</p>
                </td>
                <td className="px-6 py-4 uppercase">{request.leaveType}</td>
                <td className="px-6 py-4 text-slate-300">
                  {formatDate(request.startDate)} - {formatDate(request.endDate)}
                </td>
                <td className="px-6 py-4 text-slate-300">{request.totalDays}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={request.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!allRequests.length && (
          <div className="p-8">
            <EmptyState title="No records yet" description="Requests will show here once submitted." />
          </div>
        )}
      </div>
    </div>
  );
};

export default AllRequests;


