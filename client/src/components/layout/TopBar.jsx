import { FiBell } from 'react-icons/fi';

const TopBar = ({ title, user, onLogout }) => (
  <header className="flex flex-col gap-4 border-b border-white/5 pb-5 lg:flex-row lg:items-center lg:justify-between">
    <div>
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Overview</p>
      <h1 className="mt-1 text-2xl font-semibold text-white">{title}</h1>
    </div>

    <div className="flex items-center gap-4">
      <button className="rounded-full border border-white/10 bg-slate-900/40 p-3 text-white">
        <FiBell />
      </button>
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/40 px-4 py-2">
        <div>
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">{user?.role}</p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
);

export default TopBar;


