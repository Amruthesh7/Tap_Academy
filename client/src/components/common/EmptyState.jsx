const EmptyState = ({ title = 'Nothing here yet', description }) => (
  <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-400">
    <p className="text-lg font-semibold text-white">{title}</p>
    {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
  </div>
);

export default EmptyState;


