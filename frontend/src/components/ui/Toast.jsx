// src/components/ui/Toast.jsx
// Lightweight toast notification system (no external library)
import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

// Global toast trigger (for use outside React components — in hooks)
let _addToast = null;

export const toast = {
  success: (msg) => _addToast?.({ type: 'success', message: msg }),
  error: (msg) => _addToast?.({ type: 'error', message: msg }),
  warning: (msg) => _addToast?.({ type: 'warning', message: msg }),
};

const ICONS = {
  success: <CheckCircle size={18} className="text-green-500 shrink-0" />,
  error: <XCircle size={18} className="text-red-500 shrink-0" />,
  warning: <AlertTriangle size={18} className="text-yellow-500 shrink-0" />,
};

const BG = {
  success: 'border-green-200 bg-green-50',
  error: 'border-red-200 bg-red-50',
  warning: 'border-yellow-200 bg-yellow-50',
};

const ToastItem = ({ item, onRemove }) => {
  useEffect(() => {
    const t = setTimeout(() => onRemove(item.id), 4000);
    return () => clearTimeout(t);
  }, [item.id, onRemove]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium animate-slideIn ${BG[item.type]}`}>
      {ICONS[item.type]}
      <span className="text-slate-800 flex-1">{item.message}</span>
      <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X size={15} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Wire up the global toast object
  useEffect(() => {
    _addToast = addToast;
    return () => { _addToast = null; };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
