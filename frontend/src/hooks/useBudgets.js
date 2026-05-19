// src/hooks/useBudgets.js
import { useState, useCallback } from 'react';
import { budgetService } from '../services/budgetService';
import { toast } from '../components/ui/Toast';

const useBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBudgets = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await budgetService.getAll(params);
      setBudgets(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load budgets');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBudget = async (formData) => {
    try {
      const { data } = await budgetService.create(formData);
      toast.success('Budget created successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create budget');
      throw err;
    }
  };

  const updateBudget = async (id, formData) => {
    try {
      const { data } = await budgetService.update(id, formData);
      toast.success('Budget updated successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update budget');
      throw err;
    }
  };

  const deleteBudget = async (id) => {
    try {
      await budgetService.delete(id);
      toast.success('Budget deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete budget');
      throw err;
    }
  };

  return { budgets, loading, fetchBudgets, createBudget, updateBudget, deleteBudget };
};

export default useBudgets;
