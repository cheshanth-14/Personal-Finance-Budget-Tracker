// src/components/budgets/BudgetCard.jsx
import BudgetProgress from './BudgetProgress';
import Button from '../ui/Button';
import { Pencil, Trash2, AlertTriangle } from 'lucide-react';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
  const { categoryId, amount, spent, remaining, percentage, isExceeded } = budget;

  return (
    <div className={`glass-panel rounded-2xl p-5 hover:-translate-y-1 transition-all duration-300
      ${isExceeded ? '!border-rose-500/50' : 'border-white/10'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: categoryId?.color || '#6366f1' }}
          />
          <span className="font-semibold text-slate-200">{categoryId?.name}</span>
          {isExceeded && <AlertTriangle size={16} className="text-rose-500" />}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(budget)} className="!px-2">
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(budget)} className="!px-2 hover:!text-rose-400 hover:!bg-rose-500/10">
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {/* Budget amount */}
      <p className="text-2xl font-bold text-slate-200 mb-3">
        ${amount?.toFixed(2)}
        <span className="text-sm font-normal text-slate-400 ml-1">/ month</span>
      </p>

      {/* Progress */}
      <BudgetProgress
        percentage={percentage}
        spent={spent}
        budget={amount}
        remaining={remaining}
        isExceeded={isExceeded}
      />
    </div>
  );
};

export default BudgetCard;
