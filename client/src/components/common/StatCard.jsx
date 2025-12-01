const StatCard = ({ title, value, delta, icon: Icon, tone = 'primary' }) => {
  const toneClasses =
    tone === 'accent'
      ? 'from-brand-accent/20 to-brand-secondary/10 text-brand-accent'
      : tone === 'secondary'
        ? 'from-brand-secondary/20 to-brand-primary/5 text-brand-secondary'
        : 'from-brand-primary/20 to-brand-secondary/10 text-brand-primary';

  return (
    <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-5 shadow-lg">
      <div className="flex items-center justify-between">
        <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
        {Icon && (
          <span className={`rounded-full bg-gradient-to-br ${toneClasses} p-2`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      {delta && <p className="mt-1 text-sm text-slate-400">{delta}</p>}
    </div>
  );
};

export default StatCard;


