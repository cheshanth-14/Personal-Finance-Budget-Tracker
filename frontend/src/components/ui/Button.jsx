// src/components/ui/Button.jsx
const variants = {
  primary: 'bg-gradient-to-tr from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/25',
  secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 shadow-lg',
  danger: 'bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-white shadow-lg shadow-rose-500/25',
  ghost: 'bg-transparent hover:bg-white/10 text-slate-300',
  success: 'bg-gradient-to-tr from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-lg shadow-emerald-500/25',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...rest
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-300 active:scale-95
      ${variants[variant]} ${sizes[size]}
      ${disabled || loading ? 'opacity-60 cursor-not-allowed saturate-50' : ''}
      ${className}`}
    {...rest}
  >
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
    )}
    {children}
  </button>
);

export default Button;
