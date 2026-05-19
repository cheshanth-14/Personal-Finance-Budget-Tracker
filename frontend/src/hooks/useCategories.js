// src/hooks/useCategories.js
import { useState, useCallback } from 'react';
import { categoryService } from '../services/categoryService';
import { toast } from '../components/ui/Toast';

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await categoryService.getAll(params);
      setCategories(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = async (formData) => {
    try {
      const { data } = await categoryService.create(formData);
      toast.success('Category created successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
      throw err;
    }
  };

  const updateCategory = async (id, formData) => {
    try {
      const { data } = await categoryService.update(id, formData);
      toast.success('Category updated successfully!');
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryService.delete(id);
      toast.success('Category deleted successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      toast.error(msg);
      throw err;
    }
  };

  return { categories, loading, fetchCategories, createCategory, updateCategory, deleteCategory };
};

export default useCategories;
