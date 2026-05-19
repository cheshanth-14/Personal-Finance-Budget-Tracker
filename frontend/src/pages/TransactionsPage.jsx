// src/pages/TransactionsPage.jsx
import { useEffect, useState, useCallback } from 'react';
import useTransactions from '../hooks/useTransactions';
import useCategories from '../hooks/useCategories';
import TransactionFilters from '../components/transactions/TransactionFilters';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card, { CardBody } from '../components/ui/Card';
import { Plus } from 'lucide-react';

const INITIAL_FILTERS = { type: '', categoryId: '', startDate: '', endDate: '' };

const TransactionsPage = () => {
  const {
    transactions, pagination, loading,
    fetchTransactions, createTransaction, updateTransaction, deleteTransaction,
  } = useTransactions();
  const { categories, fetchCategories } = useCategories();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(
    (p = page, f = filters) => {
      const params = { page: p, limit: 10 };
      if (f.type) params.type = f.type;
      if (f.categoryId) params.categoryId = f.categoryId;
      if (f.startDate) params.startDate = f.startDate;
      if (f.endDate) params.endDate = f.endDate;
      fetchTransactions(params);
    },
    [page, filters, fetchTransactions]
  );

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { load(page, filters); }, [page, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createTransaction(data);
      setModalOpen(false);
      load(1, filters);
      setPage(1);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateTransaction(editTarget._id, data);
      setModalOpen(false);
      setEditTarget(null);
      load(page, filters);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTransaction(deleteTarget._id);
      setDeleteTarget(null);
      load(page, filters);
    } catch {}
  };

  const openAdd = () => { setEditTarget(null); setModalOpen(true); };
  const openEdit = (t) => { setEditTarget(t); setModalOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-sm text-slate-500 mt-1">{pagination.total} total transactions</p>
        </div>
        <Button onClick={openAdd} variant="primary">
          <Plus size={16} /> Add Transaction
        </Button>
      </div>

      <TransactionFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => handleFilterChange(INITIAL_FILTERS)}
        categories={categories}
      />

      <Card>
        <CardBody className="!p-0 !pb-2">
          <TransactionList
            transactions={transactions}
            loading={loading}
            pagination={pagination}
            onPageChange={(p) => setPage(p)}
            onEdit={openEdit}
            onDelete={setDeleteTarget}
          />
        </CardBody>
      </Card>

      {/* Floating Add Button (mobile) */}
      <button
        onClick={openAdd}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center transition-colors z-20"
        aria-label="Add transaction"
      >
        <Plus size={24} />
      </button>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? 'Edit Transaction' : 'New Transaction'}
      >
        <TransactionForm
          onSubmit={editTarget ? handleUpdate : handleCreate}
          initial={editTarget}
          categories={categories}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Transaction"
        size="sm"
      >
        <p className="text-slate-600 text-sm mb-5">
          Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TransactionsPage;
