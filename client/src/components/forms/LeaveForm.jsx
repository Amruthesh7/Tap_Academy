import { useState } from 'react';

const defaultForm = {
  leaveType: 'sick',
  startDate: '',
  endDate: '',
  reason: '',
};

const LeaveForm = ({ onSubmit, isSubmitting, message, error }) => {
  const [formData, setFormData] = useState(defaultForm);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, () => setFormData(defaultForm));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Leave Type</label>
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
          >
            <option value="sick">Sick Leave</option>
            <option value="casual">Casual Leave</option>
            <option value="vacation">Vacation</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-slate-400">Reason</label>
          <input
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Describe your leave"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="text-sm text-slate-400">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="text-sm text-slate-400">End Date</label>
          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900/40 p-3 text-white focus:border-brand-primary focus:outline-none"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-2xl bg-gradient-to-r from-brand-primary to-brand-secondary py-3 text-lg font-semibold text-white shadow-lg shadow-brand-primary/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
      </button>

      {message && <p className="text-center text-emerald-400">{message}</p>}
      {error && <p className="text-center text-rose-400">{error}</p>}
    </form>
  );
};

export default LeaveForm;


