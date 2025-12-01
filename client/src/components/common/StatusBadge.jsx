import { formatStatus, statusColor } from '../../utils/format';

const StatusBadge = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusColor(status)}`}>
    {formatStatus(status)}
  </span>
);

export default StatusBadge;


