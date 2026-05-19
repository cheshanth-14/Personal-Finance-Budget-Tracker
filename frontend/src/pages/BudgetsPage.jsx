// src/pages/BudgetsPage.jsx
import { useEffect, useState } from 'react';
import useBudgets from '../hooks/useBudgets';
import useCategories from '../hooks/useCategories';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetForm from '../components/budgets/BudgetForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import { Plus } from 'lucide-react';

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];
const now = new Date();
const currentYear = now.getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

const BudgetsPage = () => {
  const { budgets, loading, fetchBudgets, createBudget, updateBudget, deleteBudget } = useBudgets();
  const { categories, fetchCategories } = useCategories();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(currentYear);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchBudgets({ month, year }); }, [month, year]);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createBudget(data);
      setModalOpen(false);
      fetchBudgets({ month, year });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateBudget(editTarget._id, { amount: data.amount });
      setModalOpen(false);
      setEditTarget(null);
      fetchBudgets({ month, year });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudget(deleteTarget._id);
      setDeleteTarget(null);
      fetchBudgets({ month, year });
    } catch {}
  };

  const openEdit = (b) => { setEditTarget(b); setModalOpen(true); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Budgets</h1>
          <p className="text-sm text-slate-500 mt-1">{budgets.length} budget(s) this period</p>
        </div>
        <Button onClick={() => { setEditTarget(null); setModalOpen(true); }} variant="primary">
          <Plus size={16} /> Add Budget
        </Button>
      </div>

      {/* Month/Year selector */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <Select id="budget-month-sel" value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="w-40">
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </Select>
          <Select id="budget-year-sel" value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="w-28">
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      {/* Budget grid */}
      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">💰</p>
          <p className="text-base font-medium">No budgets for this period</p>
          <p className="text-sm mt-1">Click "Add Budget" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((b) => (
            <BudgetCard key={b._id} budget={b} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? 'Edit Budget' : 'New Budget'}
        size="sm"
      >
        <BudgetForm
          onSubmit={editTarget ? handleUpdate : handleCreate}
          initial={editTarget}
          categories={categories}
          loading={formLoading}
          defaultMonth={month}
          defaultYear={year}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Budget" size="sm">
        <p className="text-slate-600 text-sm mb-5">
          Delete the budget for <strong>"{deleteTarget?.categoryId?.name}"</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default BudgetsPage;
