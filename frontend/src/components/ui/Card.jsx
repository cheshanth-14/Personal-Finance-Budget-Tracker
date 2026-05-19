// src/components/ui/Card.jsx
const Card = ({ children, className = '' }) => (
  <div className={`glass-panel rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-white/20 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-white/10 ${className}`}>{children}</div>
);

export const CardBody = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export default Card;
