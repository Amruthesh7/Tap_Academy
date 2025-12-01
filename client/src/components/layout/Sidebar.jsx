import { NavLink } from 'react-router-dom';
import { FiBarChart2, FiGrid, FiLayers, FiList, FiSend, FiUser, FiUsers } from 'react-icons/fi';

const navConfig = {
  employee: [
    { label: 'Dashboard', path: '/employee/dashboard', icon: FiGrid },
    { label: 'Apply Leave', path: '/employee/apply', icon: FiSend },
    { label: 'My Requests', path: '/employee/requests', icon: FiList },
    { label: 'Profile', path: '/employee/profile', icon: FiUser },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager/dashboard', icon: FiBarChart2 },
    { label: 'Pending Requests', path: '/manager/pending', icon: FiLayers },
    { label: 'All Requests', path: '/manager/requests', icon: FiUsers },
  ],
};

const Sidebar = ({ role }) => {
  const items = navConfig[role] || [];

  return (
    <aside className="hidden min-h-screen w-64 flex-shrink-0 flex-col border-r border-white/5 bg-slate-950/70 p-6 lg:flex">
      <div className="mb-10">
        <div className="text-lg font-semibold text-white">Leave Manager</div>
        <p className="text-sm text-slate-400">Smart time-off tracking</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg shadow-brand-primary/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;


