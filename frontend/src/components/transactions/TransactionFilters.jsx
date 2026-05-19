// src/components/transactions/TransactionFilters.jsx
import Select from '../ui/Select';
import Input from '../ui/Input';
import Button from '../ui/Button';

const TransactionFilters = ({ filters, onChange, onReset, categories = [] }) => {
  const handle = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 items-end">
        <Select label="Type" id="filter-type" value={filters.type} onChange={handle('type')}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>

        <Select label="Category" id="filter-category" value={filters.categoryId} onChange={handle('categoryId')}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </Select>

        <Input
          label="From Date"
          id="filter-start"
          type="date"
          value={filters.startDate}
          onChange={handle('startDate')}
        />

        <Input
          label="To Date"
          id="filter-end"
          type="date"
          value={filters.endDate}
          onChange={handle('endDate')}
        />

        <Button variant="secondary" onClick={onReset} className="w-full">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default TransactionFilters;
