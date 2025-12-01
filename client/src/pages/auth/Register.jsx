import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      const destination = formData.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard';
      navigate(destination, { replace: true });
    } else {
      setError(result.payload);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-16 lg:flex-row">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-brand-primary/10">
          <h2 className="text-2xl font-semibold">Create an account</h2>
          <p className="mb-8 text-sm text-slate-400">Empower your team with smarter leave flows</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-400">Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-sm text-slate-400">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <button
                type="submit"
                className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-lg font-medium text-white shadow-xl shadow-brand-primary/40"
            >
                {status === 'loading' ? 'Creating...' : 'Create account'}
            </button>
          </form>

          {error && <p className="mt-4 text-center text-rose-400">{error}</p>}

          <p className="mt-6 text-center text-sm text-slate-400">
            Already onboard?{' '}
            <Link to="/login" className="text-brand-primary hover:underline">
              Login
            </Link>
          </p>
        </div>

        <div className="flex-1 space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Why teams switch</p>
          <h1 className="text-4xl font-semibold leading-tight">
            Approvals, balance tracking & analytics{' '}
            <span className="text-brand-secondary">without spreadsheets.</span>
          </h1>
          <ul className="space-y-4 text-slate-300">
            <li>• Automated balance deductions & refunds</li>
            <li>• Manager insights across teams and types</li>
            <li>• Real-time status updates and reminders</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;


