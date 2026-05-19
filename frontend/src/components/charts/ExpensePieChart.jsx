// src/components/charts/ExpensePieChart.jsx
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl rounded-xl px-4 py-3 text-sm">
        <p className="font-semibold text-slate-200">{payload[0].name}</p>
        <p className="text-slate-300">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const ExpensePieChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-56 text-slate-400 text-sm">
        No expense data for this period
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          labelLine={false}
          label={renderCustomLabel}
        >
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color || '#6366f1'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensePieChart;
