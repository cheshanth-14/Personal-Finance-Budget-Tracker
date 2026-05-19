// src/components/dashboard/RecentTransactions.jsx
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const RecentTransactions = ({ transactions = [] }) => {
  if (!transactions.length) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">
        No recent transactions
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-50">
      {transactions.map((t) => (
        <li key={t._id} className="flex items-center justify-between py-3 hover:bg-white/5 rounded-xl px-2 transition-colors">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0
              ${t.type === 'income' ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
              {t.type === 'income'
                ? <ArrowUpRight size={18} className="text-emerald-400" />
                : <ArrowDownRight size={18} className="text-rose-400" />}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">{t.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge color={t.categoryId?.color}>{t.categoryId?.name || 'Unknown'}</Badge>
                <span className="text-xs text-slate-400">{formatDate(t.date)}</span>
              </div>
            </div>
          </div>
          <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default RecentTransactions;
