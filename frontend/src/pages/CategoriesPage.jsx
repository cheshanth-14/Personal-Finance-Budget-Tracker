// src/pages/CategoriesPage.jsx
import { useEffect, useState } from 'react';
import useCategories from '../hooks/useCategories';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { Plus } from 'lucide-react';

const CategoriesPage = () => {
  const { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory } = useCategories();

  const [tab, setTab] = useState('expense');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => { fetchCategories(); }, []);

  const filtered = categories.filter((c) => c.type === tab);

  const handleCreate = async (data) => {
    setFormLoading(true);
    try {
      await createCategory(data);
      setModalOpen(false);
      fetchCategories();
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      await updateCategory(editTarget._id, { name: data.name, color: data.color });
      setModalOpen(false);
      setEditTarget(null);
      fetchCategories();
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteTarget._id);
      setDeleteTarget(null);
      fetchCategories();
    } catch {
      // Error toast shown by hook
      setDeleteTarget(null);
    }
  };

  const openEdit = (c) => { setEditTarget(c); setModalOpen(true); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your income & expense categories</p>
        </div>
        <Button onClick={() => { setEditTarget(null); setModalOpen(true); }} variant="primary">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <Card>
        {/* Tabs */}
        <CardHeader className="!py-0 !border-b-0">
          <div className="flex border-b border-white/10">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-3.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px
                  ${tab === t
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'}`}
              >
                {t === 'income' ? '💰' : '💸'} {t} Categories
              </button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : (
            <CategoryList categories={filtered} onEdit={openEdit} onDelete={setDeleteTarget} />
          )}
        </CardBody>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        title={editTarget ? 'Edit Category' : 'New Category'}
        size="sm"
      >
        <CategoryForm
          onSubmit={editTarget ? handleUpdate : handleCreate}
          initial={editTarget}
          loading={formLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Category" size="sm">
        <p className="text-slate-300 text-sm mb-5">
          Delete category <strong>"{deleteTarget?.name}"</strong>?
          This will fail if any transactions use this category.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;
