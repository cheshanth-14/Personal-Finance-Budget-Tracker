// src/hooks/useDashboard.js
import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { toast } from '../components/ui/Toast';

const useDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSummary = useCallback(async (params = {}) => {
    try {
      const { data } = await dashboardService.getSummary(params);
      setSummary(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load summary');
    }
  }, []);

  const fetchCharts = useCallback(async (params = {}) => {
    try {
      const { data } = await dashboardService.getCharts(params);
      setCharts(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load chart data');
    }
  }, []);

  const fetchRecentTransactions = useCallback(async () => {
    try {
      const { data } = await dashboardService.getRecentTransactions();
      setRecentTransactions(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load recent transactions');
    }
  }, []);

  const fetchAll = useCallback(async (month, year) => {
    setLoading(true);
    await Promise.all([
      fetchSummary({ month, year }),
      fetchCharts({ year }),
      fetchRecentTransactions(),
    ]);
    setLoading(false);
  }, [fetchSummary, fetchCharts, fetchRecentTransactions]);

  return { summary, charts, recentTransactions, loading, fetchAll };
};

export default useDashboard;
