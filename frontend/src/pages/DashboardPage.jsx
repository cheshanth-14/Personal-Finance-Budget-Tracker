// src/pages/DashboardPage.jsx
import { useEffect } from 'react';
import useDashboard from '../hooks/useDashboard';
import SummaryCard from '../components/dashboard/SummaryCard';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomeExpenseBarChart from '../components/charts/IncomeExpenseBarChart';
import BudgetVsActualChart from '../components/charts/BudgetVsActualChart';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';

const now = new Date();

const DashboardPage = () => {
  const { summary, charts, recentTransactions, loading, fetchAll } = useDashboard();

  useEffect(() => {
    fetchAll(now.getMonth() + 1, now.getFullYear());
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  const monthName = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">{monthName} {year} overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard type="income" value={summary?.totalIncome} />
        <SummaryCard type="expense" value={summary?.totalExpenses} />
        <SummaryCard type="balance" value={summary?.balance} />
        <SummaryCard type="budget" value={summary?.budgetUsage} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-white">Expense Breakdown</h2>
            <p className="text-xs text-slate-400 mt-0.5">By category this year</p>
          </CardHeader>
          <CardBody>
            <ExpensePieChart data={charts?.expenseByCategory || []} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-white">Budget vs Actual</h2>
            <p className="text-xs text-slate-400 mt-0.5">This month's budget performance</p>
          </CardHeader>
          <CardBody>
            <BudgetVsActualChart data={charts?.budgetVsActual || []} />
          </CardBody>
        </Card>
      </div>

      {/* Monthly Trend — full width */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-white">Income vs Expenses</h2>
          <p className="text-xs text-slate-400 mt-0.5">Monthly trend for {year}</p>
        </CardHeader>
        <CardBody>
          <IncomeExpenseBarChart data={charts?.monthlyTrend || []} />
        </CardBody>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold text-white">Recent Transactions</h2>
        </CardHeader>
        <CardBody className="!py-2">
          <RecentTransactions transactions={recentTransactions} />
        </CardBody>
      </Card>
    </div>
  );
};

export default DashboardPage;
