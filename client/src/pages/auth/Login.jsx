import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      const destination =
        result.payload.user.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
      navigate(location.state?.from?.pathname || destination, { replace: true });
    } else {
      setError(result.payload);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:flex-row">
        <div className="flex-1 space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Leave Manager</p>
          <h1 className="text-4xl font-semibold leading-tight">
            Modern Leave Management for <span className="text-brand-primary">Hybrid Teams</span>
          </h1>
          <p className="text-slate-400">
            Track balances, approve requests, and keep teams aligned through a single, unified
            workspace.
          </p>
        </div>

        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-brand-primary/10">
          <h2 className="text-2xl font-semibold">Welcome back</h2>
          <p className="mb-8 text-sm text-slate-400">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="you@company.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Password</label>
              <input
                type="password"
                name="password"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-lg font-medium text-white shadow-xl shadow-brand-primary/50"
            >
              {status === 'loading' ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {error && <p className="mt-4 text-center text-rose-400">{error}</p>}

          <p className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <Link to="/register" className="text-brand-primary hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;


