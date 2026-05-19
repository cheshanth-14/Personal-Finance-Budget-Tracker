// src/components/categories/CategoryForm.jsx
import { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#ec4899', '#ef4444',
  '#f97316', '#f59e0b', '#22c55e', '#14b8a6', '#3b82f6',
];

const CategoryForm = ({ onSubmit, initial, loading }) => {
  const [form, setForm] = useState({ name: '', type: 'expense', color: '#6366f1' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({ name: initial.name || '', type: initial.type || 'expense', color: initial.color || '#6366f1' });
    } else {
      setForm({ name: '', type: 'expense', color: '#6366f1' });
    }
    setErrors({});
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Category name is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Category Name" id="cat-name" value={form.name} onChange={set('name')} error={errors.name} placeholder="e.g. Groceries" />

      {!initial && (
        <Select label="Type" id="cat-type" value={form.type} onChange={set('type')}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </Select>
      )}

      {/* Color picker */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700">Color</label>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_COLORS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setForm((prev) => ({ ...prev, color: c }))}
              className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110
                ${form.color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={form.color}
            onChange={set('color')}
            className="w-7 h-7 rounded-full cursor-pointer border border-slate-300"
            title="Custom color"
          />
        </div>
      </div>

      <Button type="submit" variant="primary" className="w-full" loading={loading}>
        {initial ? 'Update Category' : 'Add Category'}
      </Button>
    </form>
  );
};

export default CategoryForm;
