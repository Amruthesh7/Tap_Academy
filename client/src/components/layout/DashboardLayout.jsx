import { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { logoutUser } from '../../features/authSlice';

const titles = {
  '/employee/dashboard': 'Employee Dashboard',
  '/employee/apply': 'Apply for Leave',
  '/employee/requests': 'My Leave Requests',
  '/employee/profile': 'My Profile',
  '/manager/dashboard': 'Manager Dashboard',
  '/manager/pending': 'Pending Requests',
  '/manager/requests': 'All Requests',
};

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  const pageTitle = useMemo(() => titles[location.pathname] || 'Overview', [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="flex">
        <Sidebar role={user?.role} />
        <div className="flex w-full flex-col gap-8 p-6 lg:px-10 lg:py-8">
          <TopBar title={pageTitle} user={user} onLogout={() => dispatch(logoutUser())} />
          <div className="glass-panel p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;


