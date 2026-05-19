// src/services/budgetService.js
import axiosInstance from '../utils/axiosInstance';

export const budgetService = {
  getAll: (params) => axiosInstance.get('/budgets', { params }),
  create: (data) => axiosInstance.post('/budgets', data),
  update: (id, data) => axiosInstance.put(`/budgets/${id}`, data),
  delete: (id) => axiosInstance.delete(`/budgets/${id}`),
};
