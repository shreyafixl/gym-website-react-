import { useState, useEffect, useCallback } from 'react';
import BillingService from '../services/superadmin/BillingService';
import RevenueService from '../services/superadmin/RevenueService';
import MaintenanceService from '../services/superadmin/MaintenanceService';

/**
 * Custom Hook: useSuperAdminFinance
 * Fetches billing, revenue, and maintenance data from backend APIs
 */
export const useSuperAdminFinance = () => {
  // Billing State
  const [billingData, setBillingData] = useState([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [billingError, setBillingError] = useState(null);

  // Revenue State
  const [revenueData, setRevenueData] = useState(null);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [revenueError, setRevenueError] = useState(null);

  // Maintenance State
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(null);

  // ─── FETCH BILLING DATA ───────────────────────────────────────────────────
  const fetchBillingData = useCallback(async (page = 1, perPage = 100) => {
    try {
      setBillingLoading(true);
      setBillingError(null);
      const response = await BillingService.getAll({ page, perPage });
      if (response?.data) {
        setBillingData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error fetching billing data:', err);
      setBillingError('Failed to load billing records');
      setBillingData([]);
    } finally {
      setBillingLoading(false);
    }
  }, []);

  // ─── FETCH REVENUE DATA ───────────────────────────────────────────────────
  const fetchRevenueData = useCallback(async (period = 'monthly') => {
    try {
      setRevenueLoading(true);
      setRevenueError(null);
      const [summary, trends] = await Promise.all([
        RevenueService.getRevenueSummary({ period }),
        RevenueService.getRevenueTrends(30),
      ]);
      setRevenueData({ summary, trends });
    } catch (err) {
      console.error('Error fetching revenue data:', err);
      setRevenueError('Failed to load revenue data');
      setRevenueData(null);
    } finally {
      setRevenueLoading(false);
    }
  }, []);

  // ─── FETCH MAINTENANCE DATA ───────────────────────────────────────────────
  const fetchMaintenanceData = useCallback(async (page = 1, perPage = 100) => {
    try {
      setMaintenanceLoading(true);
      setMaintenanceError(null);
      const response = await MaintenanceService.getMaintenanceRecords(page, perPage);
      if (response?.data) {
        setMaintenanceData(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
      setMaintenanceError('Failed to load maintenance records');
      setMaintenanceData([]);
    } finally {
      setMaintenanceLoading(false);
    }
  }, []);

  // ─── RETURN STATE AND FUNCTIONS ────────────────────────────────────────────
  return {
    // Billing
    billingData,
    billingLoading,
    billingError,
    fetchBillingData,

    // Revenue
    revenueData,
    revenueLoading,
    revenueError,
    fetchRevenueData,

    // Maintenance
    maintenanceData,
    maintenanceLoading,
    maintenanceError,
    fetchMaintenanceData,
  };
};

export default useSuperAdminFinance;
