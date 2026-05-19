// src/components/charts/BudgetVsActualChart.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-slate-200 mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.dataKey} style={{ color: p.fill }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const BudgetVsActualChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-56 text-slate-400 text-sm">
        No budget data for this month
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          tickFormatter={(v) => `Rs. ${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Legend formatter={(val) => <span className="text-xs text-slate-300 capitalize">{val}</span>} />
        <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="spent" name="Spent" fill="#f97316" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BudgetVsActualChart;
