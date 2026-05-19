// src/services/dashboardService.js
import axiosInstance from '../utils/axiosInstance';

export const dashboardService = {
  getSummary: (params) => axiosInstance.get('/dashboard/summary', { params }),
  getCharts: (params) => axiosInstance.get('/dashboard/charts', { params }),
  getRecentTransactions: () => axiosInstance.get('/dashboard/recent-transactions'),
};
