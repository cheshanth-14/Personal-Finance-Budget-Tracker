// src/components/ui/ProgressBar.jsx
/**
 * ProgressBar — color changes based on percentage:
 * < 80%  → green
 * 80–99% → yellow
 * ≥ 100% → red
 */
const ProgressBar = ({ percentage, className = '' }) => {
  const pct = Math.min(percentage, 100);
  const color =
    percentage >= 100
      ? 'bg-red-500'
      : percentage >= 80
      ? 'bg-yellow-400'
      : 'bg-green-500';

  return (
    <div className={`w-full bg-slate-100 rounded-full h-2.5 overflow-hidden ${className}`}>
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
