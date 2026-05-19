// src/components/budgets/BudgetForm.jsx
import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' }, { value: 4, label: 'April' },
  { value: 5, label: 'May' }, { value: 6, label: 'June' },
  { value: 7, label: 'July' }, { value: 8, label: 'August' },
  { value: 9, label: 'September' }, { value: 10, label: 'October' },
  { value: 11, label: 'November' }, { value: 12, label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const BudgetForm = ({ onSubmit, initial, categories = [], loading, defaultMonth, defaultYear }) => {
  const now = new Date();
  const [form, setForm] = useState({
    categoryId: '',
    amount: '',
    month: defaultMonth || now.getMonth() + 1,
    year: defaultYear || now.getFullYear(),
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        categoryId: initial.categoryId?._id || initial.categoryId || '',
        amount: initial.amount || '',
        month: initial.month || now.getMonth() + 1,
        year: initial.year || now.getFullYear(),
      });
    }
    setErrors({});
  }, [initial]);

  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const validate = () => {
    const e = {};
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (!form.amount || parseFloat(form.amount) < 1) e.amount = 'Amount must be at least 1';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount), month: parseInt(form.month), year: parseInt(form.year) });
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!initial && (
        <Select label="Category (Expense)" id="budget-cat" value={form.categoryId} onChange={set('categoryId')} error={errors.categoryId}>
          <option value="">Select a category...</option>
          {expenseCategories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </Select>
      )}

      <Input label="Budget Amount ($)" id="budget-amount" type="number" min="1" step="0.01"
        value={form.amount} onChange={set('amount')} error={errors.amount} placeholder="Enter budget limit" />

      {!initial && (
        <div className="grid grid-cols-2 gap-3">
          <Select label="Month" id="budget-month" value={form.month} onChange={set('month')}>
            {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </Select>
          <Select label="Year" id="budget-year" value={form.year} onChange={set('year')}>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        {initial ? 'Update Budget' : 'Create Budget'}
      </Button>
    </form>
  );
};

export default BudgetForm;
