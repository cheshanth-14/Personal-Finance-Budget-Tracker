// src/components/transactions/TransactionItem.jsx
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { title, amount, type, categoryId, date, note } = transaction;

  return (
    <li className="flex items-center justify-between py-4 px-4 hover:bg-white/5 rounded-xl transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
          {type === 'income'
            ? <ArrowUpRight size={20} className="text-emerald-400" />
            : <ArrowDownRight size={20} className="text-rose-400" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-200 truncate">{title}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {categoryId && (
              <Badge color={categoryId.color}>{categoryId.name}</Badge>
            )}
            <span className="text-xs text-slate-400">{formatDate(date)}</span>
            {note && <span className="text-xs text-slate-400 truncate max-w-[160px]">{note}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 ml-2 shrink-0">
        <span className={`text-sm font-bold ${type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
          {type === 'income' ? '+' : '-'}{formatCurrency(amount)}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="sm" onClick={() => onEdit(transaction)} className="!px-2">
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(transaction)} className="!px-2 hover:!text-rose-400 hover:!bg-rose-500/10">
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </li>
  );
};

export default TransactionItem;
