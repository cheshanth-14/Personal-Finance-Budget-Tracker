// src/components/dashboard/SummaryCard.jsx
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const config = {
  income: {
    label: 'Total Income',
    icon: TrendingUp,
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-gradient-to-tr from-emerald-500 to-emerald-400',
    textColor: 'text-emerald-400',
  },
  expense: {
    label: 'Total Expenses',
    icon: TrendingDown,
    bg: 'bg-rose-500/10',
    iconBg: 'bg-gradient-to-tr from-rose-500 to-rose-400',
    textColor: 'text-rose-400',
  },
  balance: {
    label: 'Current Balance',
    icon: DollarSign,
    bg: 'bg-indigo-500/10',
    iconBg: 'bg-gradient-to-tr from-indigo-500 to-indigo-400',
    textColor: 'text-indigo-400',
  },
  budget: {
    label: 'Budget Usage',
    icon: PieChart,
    bg: 'bg-amber-500/10',
    iconBg: 'bg-gradient-to-tr from-amber-500 to-amber-400',
    textColor: 'text-amber-400',
  },
};

const SummaryCard = ({ type, value }) => {
  const { label, icon: Icon, bg, iconBg, textColor } = config[type];
  const isPercentage = type === 'budget';

  return (
    <div className={`rounded-2xl p-5 ${bg} border border-white/10 shadow-lg backdrop-blur-md hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-300">{label}</p>
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={20} className="text-white" />
        </div>
      </div>
      <p className={`text-2xl font-bold ${textColor}`}>
        {isPercentage ? `${value?.toFixed(1) ?? 0}%` : formatCurrency(value ?? 0)}
      </p>
    </div>
  );
};

export default SummaryCard;
