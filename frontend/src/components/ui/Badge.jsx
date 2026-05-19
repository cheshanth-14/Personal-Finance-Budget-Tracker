// src/components/ui/Badge.jsx
const colorMap = {
  income: 'bg-green-100 text-green-700',
  expense: 'bg-red-100 text-red-700',
  default: 'bg-slate-100 text-slate-700',
};

const Badge = ({ children, type, color, className = '' }) => {
  const baseClass = colorMap[type] || colorMap.default;
  const style = color ? { backgroundColor: `${color}22`, color } : {};

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${!color ? baseClass : ''} ${className}`}
      style={color ? style : {}}
    >
      {color && <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />}
      {children}
    </span>
  );
};

export default Badge;
