// src/services/transactionService.js
import axiosInstance from '../utils/axiosInstance';

export const transactionService = {
  getAll: (params) => axiosInstance.get('/transactions', { params }),
  create: (data) => axiosInstance.post('/transactions', data),
  update: (id, data) => axiosInstance.put(`/transactions/${id}`, data),
  delete: (id) => axiosInstance.delete(`/transactions/${id}`),
};
