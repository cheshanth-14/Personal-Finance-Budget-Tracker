// src/components/transactions/TransactionList.jsx
import TransactionItem from './TransactionItem';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TransactionList = ({
  transactions = [],
  loading,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-base font-medium">No transactions found</p>
        <p className="text-sm mt-1">Add your first transaction using the + button</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-slate-100">
        {transactions.map((t) => (
          <TransactionItem
            key={t._id}
            transaction={t}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Page {pagination.page} of {pagination.pages} — {pagination.total} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              <ChevronLeft size={16} /> Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={pagination.page >= pagination.pages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
