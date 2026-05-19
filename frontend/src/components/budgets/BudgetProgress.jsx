// src/components/budgets/BudgetProgress.jsx
import ProgressBar from '../ui/ProgressBar';

const BudgetProgress = ({ percentage, spent, budget, remaining, isExceeded }) => (
  <div className="space-y-2">
    <ProgressBar percentage={percentage} />
    <div className="flex justify-between text-xs text-slate-500">
      <span>
        Spent: <span className={`font-semibold ${isExceeded ? 'text-red-600' : 'text-slate-700'}`}>
          ${spent?.toFixed(2) ?? '0.00'}
        </span>
      </span>
      <span>
        Limit: <span className="font-semibold text-slate-700">${budget?.toFixed(2) ?? '0.00'}</span>
      </span>
    </div>
    {isExceeded && (
      <p className="text-xs font-medium text-red-600">
        ⚠ Over budget by ${Math.abs(remaining)?.toFixed(2)}
      </p>
    )}
    {!isExceeded && (
      <p className="text-xs text-slate-500">
        ${remaining?.toFixed(2) ?? '0.00'} remaining ({percentage?.toFixed(1)}% used)
      </p>
    )}
  </div>
);

export default BudgetProgress;
