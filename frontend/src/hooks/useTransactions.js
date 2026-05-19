// src/hooks/useTransactions.js
import { useState, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { toast } from '../components/ui/Toast';

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await transactionService.getAll(params);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTransaction = async (formData) => {
    try {
      const { data } = await transactionService.create(formData);
      toast.success('Transaction added successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create transaction';
      toast.error(msg);
      throw err;
    }
  };

  const updateTransaction = async (id, formData) => {
    try {
      const { data } = await transactionService.update(id, formData);
      toast.success('Transaction updated successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update transaction';
      toast.error(msg);
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await transactionService.delete(id);
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete transaction');
      throw err;
    }
  };

  return {
    transactions,
    pagination,
    loading,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};

export default useTransactions;
