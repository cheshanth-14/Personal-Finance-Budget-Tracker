// src/components/transactions/TransactionForm.jsx
import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import { formatDateInput } from '../../utils/formatDate';

const INITIAL = { title: '', amount: '', type: 'expense', categoryId: '', date: '', note: '' };

const TransactionForm = ({ onSubmit, initial, categories = [], loading }) => {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title || '',
        amount: initial.amount || '',
        type: initial.type || 'expense',
        categoryId: initial.categoryId?._id || initial.categoryId || '',
        date: formatDateInput(initial.date) || '',
        note: initial.note || '',
      });
    } else {
      setForm({ ...INITIAL, date: formatDateInput(new Date()) });
    }
    setErrors({});
  }, [initial]);

  const filteredCategories = categories.filter((c) => c.type === form.type);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || parseFloat(form.amount) < 0.01) e.amount = 'Amount must be at least 0.01';
    if (!form.categoryId) e.categoryId = 'Category is required';
    if (!form.date) e.date = 'Date is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  };

  const set = (field) => (e) => {
    const val = e.target.value;
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      // Clear categoryId when type changes
      if (field === 'type') updated.categoryId = '';
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" id="tx-title" value={form.title} onChange={set('title')} error={errors.title} placeholder="e.g. Monthly salary" />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Amount (Rs.)" id="tx-amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={set('amount')} error={errors.amount} placeholder="0.00" />
        <Select label="Type" id="tx-type" value={form.type} onChange={set('type')}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      </div>

      <Select label="Category" id="tx-category" value={form.categoryId} onChange={set('categoryId')} error={errors.categoryId}>
        <option value="">Select a category...</option>
        {filteredCategories.map((c) => (
          <option key={c._id} value={c._id}>{c.name}</option>
        ))}
      </Select>

      <Input label="Date" id="tx-date" type="date" value={form.date} onChange={set('date')} error={errors.date} />

      <div className="flex flex-col gap-1">
        <label htmlFor="tx-note" className="text-sm font-medium text-slate-700">Note (optional)</label>
        <textarea
          id="tx-note"
          rows={2}
          maxLength={300}
          value={form.note}
          onChange={set('note')}
          placeholder="Add a note..."
          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
        />
      </div>

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        {initial ? 'Update Transaction' : 'Add Transaction'}
      </Button>
    </form>
  );
};

export default TransactionForm;
