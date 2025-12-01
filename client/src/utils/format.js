import dayjs from 'dayjs';

export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');

export const formatStatus = (status) => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
      return 'Pending';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export const statusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-500/10 text-emerald-400';
    case 'rejected':
      return 'bg-rose-500/10 text-rose-400';
    case 'pending':
      return 'bg-amber-500/10 text-amber-400';
    case 'cancelled':
      return 'bg-slate-500/10 text-slate-300';
    default:
      return 'bg-slate-500/10 text-slate-300';
  }
};


