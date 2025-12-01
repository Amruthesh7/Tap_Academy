import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyData } from '../../features/leaveSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.leaves);

  useEffect(() => {
    dispatch(fetchMyData());
  }, [dispatch]);

  const info = [
    { label: 'Name', value: user?.name },
    { label: 'Email', value: user?.email },
    { label: 'Role', value: user?.role },
    { label: 'Member since', value: new Date(user?.createdAt || Date.now()).toDateString() },
  ];

  const balanceEntries = [
    { label: 'Sick leave', value: balance?.sickLeave || 0 },
    { label: 'Casual leave', value: balance?.casualLeave || 0 },
    { label: 'Vacation leave', value: balance?.vacationLeave || 0 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-8">
        <h2 className="text-xl font-semibold text-white">Profile</h2>
        <p className="text-sm text-slate-400">Your identity inside the workspace.</p>

        <div className="mt-6 space-y-4 text-sm">
          {info.map((item) => (
            <div key={item.label} className="flex justify-between border-b border-white/5 pb-3">
              <p className="text-slate-400">{item.label}</p>
              <p className="text-white">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/5 bg-slate-900/60 p-8">
        <h2 className="text-xl font-semibold text-white">Balance snapshot</h2>
        <p className="text-sm text-slate-400">Live view of remaining quota.</p>

        <div className="mt-6 space-y-4">
          {balanceEntries.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white/5 px-4 py-3">
              <p className="text-slate-400">{item.label}</p>
              <p className="text-2xl font-semibold text-white">{item.value} days</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;


