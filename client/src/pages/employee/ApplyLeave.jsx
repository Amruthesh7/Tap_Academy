import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import LeaveForm from '../../components/forms/LeaveForm';
import { applyForLeave, clearMessage } from '../../features/leaveSlice';

const ApplyLeave = () => {
  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.leaves);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, resetForm) => {
    setIsSubmitting(true);
    const result = await dispatch(applyForLeave(values));
    setIsSubmitting(false);

    if (applyForLeave.fulfilled.match(result)) {
      resetForm();
      setTimeout(() => dispatch(clearMessage()), 3000);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-white">Plan your time off</h2>
      <p className="text-sm text-slate-400">Submit a request and we will route it to your manager.</p>

      <div className="mt-8 rounded-3xl border border-white/5 bg-slate-900/60 p-8">
        <LeaveForm onSubmit={handleSubmit} isSubmitting={isSubmitting} message={message} error={error} />
      </div>
    </div>
  );
};

export default ApplyLeave;


