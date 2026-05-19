// src/components/ui/Input.jsx
const Input = ({
  label,
  id,
  error,
  className = '',
  ...rest
}) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`w-full px-3 py-2 rounded-lg border text-sm transition-colors text-white
        ${error
          ? 'border-rose-500/50 focus:ring-rose-500/30 focus:border-rose-500'
          : 'border-white/10 focus:ring-indigo-500/30 focus:border-indigo-400'}
        focus:outline-none focus:ring-2 bg-slate-900/50 backdrop-blur-md placeholder:text-slate-500 ${className}`}
      {...rest}
    />
    {error && <p className="text-xs text-rose-400 mt-0.5">{error}</p>}
  </div>
);

export default Input;
