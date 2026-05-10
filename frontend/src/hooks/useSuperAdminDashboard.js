import { useState, useEffect, useCallback } from 'react';
import superAdminService from '../services/superAdminService';
// Import all services
import DashboardService from '../services/superadmin/DashboardService';
import UserService from '../services/superadmin/UserService';
import BranchService from '../services/superadmin/BranchService';
import BillingService from '../services/superadmin/BillingService';
import RevenueService from '../services/superadmin/RevenueService';
import TransactionService from '../services/superadmin/TransactionService';
import PlansService from '../services/superadmin/PlansService';
import ReportsService from '../services/superadmin/ReportsService';
import AnalyticsService from '../services/superadmin/AnalyticsService';
import NotificationsService from '../services/superadmin/NotificationsService';
import CampaignsService from '../services/superadmin/CampaignsService';
import CommunicationService from '../services/superadmin/CommunicationService';
import EquipmentService from '../services/superadmin/EquipmentService';
import VendorsService from '../services/superadmin/VendorsService';
import MaintenanceService from '../services/superadmin/MaintenanceService';
import IntegrationService from '../services/superadmin/IntegrationService';
import DataService from '../services/superadmin/DataService';
import BackupsService from '../services/superadmin/BackupsService';
import AdvancedService from '../services/superadmin/AdvancedService';
import SecurityService from '../services/superadmin/SecurityService';
import SettingsService from '../services/superadmin/SettingsService';
import SupportService from '../services/superadmin/SupportService';
import ContentService from '../services/superadmin/ContentService';

/**
 * Custom Hook: useSuperAdminDashboard
 * Fetches and manages dynamic dashboard data from backend APIs
 * Preserves all existing UI, styling, and component structure
 */
export const useSuperAdminDashboard = () => {
  // ─── STATE ────────────────────────────────────────────────────────────────
  const [globalStats, setGlobalStats] = useState([]);
  const [branches, setBranches] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [membershipPlans, setMembershipPlans] = useState([]);
  const [financialReports, setFinancialReports] = useState({ monthly: [] });
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);
  const [memberGrowth, setMemberGrowth] = useState([]);
  const [auditLog, setAuditLog] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [featureFlags, setFeatureFlags] = useState([]);
  const [liveMonitoring, setLiveMonitoring] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [systemSettings, setSystemSettings] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ─── FETCH OVERVIEW DATA ──────────────────────────────────────────────────
  const fetchOverview = useCallback(async () => {
    try {
      const data = await superAdminService.getOverview();
      if (data) {
        // Transform backend response to match existing UI structure
        const stats = [
          {
            id: 1,
            label: 'Total Members',
            value: data.overview?.totalMembers || 0,
            icon: '👥',
            change: '+12% from last month',
            color: '#3b82f6',
          },
          {
            id: 2,
            label: 'Active Members',
            value: data.overview?.activeMembers || 0,
            icon: '✅',
            change: '+8% from last month',
            color: '#22c55e',
          },
          {
            id: 3,
            label: 'Total Trainers',
            value: data.overview?.totalTrainers || 0,
            icon: '🏋️',
            change: '+2 new trainers',
            color: '#f97316',
          },
          {
            id: 4,
            label: 'Total Branches',
            value: data.overview?.totalBranches || 0,
            icon: '🏢',
            change: 'All operational',
            color: '#8b5cf6',
          },
          {
            id: 5,
            label: 'Total Revenue',
            value: `₹${(data.revenue?.total || 0).toLocaleString()}`,
            icon: '💰',
            change: '+15% from last month',
            color: '#f59e0b',
          },
          {
            id: 6,
            label: 'Transactions',
            value: data.revenue?.transactions || 0,
            icon: '📊',
            change: '+5% from last month',
            color: '#ec4899',
          },
        ];
        setGlobalStats(stats);

        // Set financial reports
        if (data.revenue?.monthlyBreakdown) {
          setFinancialReports({
            monthly: data.revenue.monthlyBreakdown.map(item => ({
              month: item.month || item._id,
              revenue: item.revenue || 0,
              profit: item.profit || 0,
            })),
          });
        } else {
          // Fallback if monthlyBreakdown is not available
          setFinancialReports({
            monthly: [],
          });
        }
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching overview:', {
        message: err.message,
        code: err.code,
        isNetworkError: !err.response,
      });
      // Don't set error here - let initializeData handle it
      throw err;
    }
  }, []);

  // ─── FETCH USERS ──────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    try {
      const data = await superAdminService.getUsers(1, 100);
      if (data?.users && Array.isArray(data.users)) {
        setAllUsers(
          data.users.map(user => ({
            id: user?._id || Math.random(),
            name: user?.fullName || user?.name || 'Unknown',
            email: user?.email || 'N/A',
            role: user?.role || 'member',
            branch: user?.assignedBranch || 'N/A',
            lastLogin: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
            status: user?.isActive ? 'active' : 'inactive',
          }))
        );
      } else {
        setAllUsers([]);
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching users:', err.message);
      setAllUsers([]);
    }
  }, []);

  // ─── FETCH BRANCHES ───────────────────────────────────────────────────────
  const fetchBranches = useCallback(async () => {
    try {
      const data = await superAdminService.getBranches(1, 100);
      if (data?.branches && Array.isArray(data.branches)) {
        setBranches(
          data.branches.map(branch => ({
            id: branch?._id || Math.random(),
            name: branch?.branchName || branch?.name || 'Unknown',
            city: branch?.city || 'N/A',
            members: branch?.totalMembers || 0,
            revenue: `₹${((branch?.revenue || 0)).toLocaleString()}`,
            trainers: branch?.totalTrainers || 0,
            growth: `+${branch?.growthPercentage || 0}%`,
            status: branch?.isActive ? 'active' : 'inactive',
          }))
        );
      } else {
        setBranches([]);
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching branches:', err.message);
      setBranches([]);
    }
  }, []);

  // ─── FETCH MEMBERSHIP PLANS ────────────────────────────────────────────────
  const fetchMembershipPlans = useCallback(async () => {
    try {
      const data = await superAdminService.getMembershipPlans();
      if (data?.plans) {
        setMembershipPlans(
          data.plans.map(plan => ({
            id: plan._id,
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: plan.features || [],
            members: plan.memberCount || 0,
            status: plan.isActive ? 'active' : 'inactive',
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching membership plans:', err);
    }
  }, []);

  // ─── FETCH NOTIFICATIONS ──────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await superAdminService.getNotifications(1, 50);
      if (data?.notifications) {
        setNotifications(
          data.notifications.map(notif => ({
            id: notif._id,
            title: notif.title,
            message: notif.message,
            type: notif.type || 'info',
            time: notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString() : 'Now',
            read: notif.isRead || false,
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  // ─── FETCH TRANSACTIONS ───────────────────────────────────────────────────
  const fetchTransactions = useCallback(async () => {
    try {
      const data = await TransactionService.getTransactions(1, 50);
      if (data?.transactions) {
        setTransactions(
          data.transactions.map(transaction => ({
            id: transaction._id,
            user: transaction.userId?.fullName || 'Unknown',
            amount: `₹${(transaction.amount || 0).toLocaleString()}`,
            type: transaction.type || 'payment',
            status: transaction.status || 'completed',
            date: transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A',
            method: transaction.paymentMethod || 'N/A',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching transactions:', err.message);
      setTransactions([]);
    }
  }, []);

  // ─── FETCH CAMPAIGNS ───────────────────────────────────────────────────────
  const fetchCampaigns = useCallback(async () => {
    try {
      const data = await CampaignsService.getCampaigns(1, 50);
      if (data?.campaigns) {
        setCampaigns(
          data.campaigns.map(campaign => ({
            id: campaign._id,
            name: campaign.name,
            type: campaign.type || 'email',
            target: campaign.targetAudience || 'All',
            discount: campaign.discountPercentage || 0,
            sent: campaign.sentCount || 0,
            opens: campaign.openCount || 0,
            status: campaign.status || 'active',
            startDate: campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : 'N/A',
            endDate: campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'N/A',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching campaigns:', err.message);
      // Don't set error state - campaigns are optional
      setCampaigns([]);
    }
  }, []);

  // ─── FETCH SUPPORT TICKETS ────────────────────────────────────────────────
  const fetchSupportTickets = useCallback(async () => {
    try {
      const data = await SupportService.getTickets(1, 50);
      if (data?.tickets) {
        setSupportTickets(
          data.tickets.map(ticket => ({
            id: ticket._id,
            subject: ticket.subject,
            user: ticket.userId?.fullName || 'Unknown',
            priority: ticket.priority || 'medium',
            status: ticket.status || 'open',
            date: ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching support tickets:', err.message);
      // Don't set error state - support tickets are optional
      setSupportTickets([]);
    }
  }, []);

  // ─── FETCH AUDIT LOGS ──────────────────────────────────────────────────────
  const fetchAuditLogs = useCallback(async () => {
    try {
      const data = await SecurityService.getAuditLogs(1, 50);
      if (data?.logs) {
        setAuditLog(
          data.logs.map(log => ({
            id: log._id,
            time: log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A',
            user: log.userId?.email || 'System',
            action: log.action,
            target: log.resource || 'N/A',
            ip: log.ipAddress || 'N/A',
            type: log.type || 'system',
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  }, []);

  // ─── FETCH LOGIN HISTORY ──────────────────────────────────────────────────
  const fetchLoginHistory = useCallback(async () => {
    try {
      const data = await SecurityService.getLoginHistory(1, 50);
      if (data?.history) {
        setLoginHistory(
          data.history.map(entry => ({
            id: entry._id,
            user: entry.userId?.email || 'Unknown',
            role: entry.userId?.role || '—',
            time: entry.loginTime ? new Date(entry.loginTime).toLocaleString() : 'N/A',
            device: entry.userAgent || 'Unknown',
            location: entry.location || 'Unknown',
            status: entry.status || 'success',
          }))
        );
      }
    } catch (err) {
      console.error('Error fetching login history:', err);
    }
  }, []);

  // ─── FETCH SETTINGS ───────────────────────────────────────────────────────
  const fetchSettings = useCallback(async () => {
    try {
      const data = await SettingsService.getGeneralSettings();
      if (data) {
        setSystemSettings({
          gymName: data.gymName || 'FitZone',
          email: data.supportEmail || 'support@fitzone.com',
          phone: data.phone || '+91 XXXXX XXXXX',
          timezone: data.timezone || 'IST',
          currency: data.currency || 'INR',
        });
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching settings:', err.message);
      // Don't set error state - settings are optional
      setSystemSettings({});
    }
  }, []);

  // ─── FETCH SYSTEM LOGS ────────────────────────────────────────────────────
  const fetchSystemLogs = useCallback(async () => {
    try {
      const data = await SecurityService.getSystemLogs(1, 50);
      if (data?.logs) {
        setSystemLogs(
          data.logs.map(log => ({
            id: log._id,
            time: log.createdAt ? new Date(log.createdAt).toLocaleString() : 'N/A',
            message: log.message,
            service: log.service || 'system',
            level: log.level || 'info',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching system logs:', err.message);
      setSystemLogs([]);
    }
  }, []);

  // ─── FETCH FEEDBACK DATA ──────────────────────────────────────────────────
  const fetchFeedbackData = useCallback(async () => {
    try {
      const data = await SupportService.getFeedback(1, 50);
      if (data?.feedback) {
        setFeedbackData(
          data.feedback.map(item => ({
            id: item._id,
            user: item.userId?.fullName || 'Unknown',
            rating: item.rating || 0,
            message: item.message || '',
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A',
            status: item.status || 'pending',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching feedback:', err.message);
      setFeedbackData([]);
    }
  }, []);

  // ─── FETCH EQUIPMENT ──────────────────────────────────────────────────────
  const fetchEquipment = useCallback(async () => {
    try {
      const data = await EquipmentService.getEquipment(1, 50);
      if (data?.equipment) {
        setEquipment(
          data.equipment.map(item => ({
            id: item._id,
            name: item.name,
            category: item.category || 'Other',
            branch: item.branchId?.branchName || 'N/A',
            status: item.status || 'working',
            lastService: item.lastServiceDate ? new Date(item.lastServiceDate).toLocaleDateString() : 'N/A',
            nextService: item.nextServiceDate ? new Date(item.nextServiceDate).toLocaleDateString() : 'ASAP',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching equipment:', err.message);
      // Don't set error state - equipment is optional
      setEquipment([]);
    }
  }, []);

  // ─── FETCH VENDORS ────────────────────────────────────────────────────────
  const fetchVendors = useCallback(async () => {
    try {
      const data = await VendorsService.getVendors(1, 50);
      if (data?.vendors) {
        setVendors(
          data.vendors.map(vendor => ({
            id: vendor._id,
            name: vendor.name,
            category: vendor.category || 'Other',
            contact: vendor.contactPerson || 'N/A',
            phone: vendor.phone || 'N/A',
            email: vendor.email || 'N/A',
            lastOrder: vendor.lastOrderDate ? new Date(vendor.lastOrderDate).toLocaleDateString() : 'N/A',
            status: vendor.isActive ? 'active' : 'inactive',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching vendors:', err.message);
      // Don't set error state - vendors are optional
      setVendors([]);
    }
  }, []);

  // ─── FETCH MAINTENANCE LOGS ───────────────────────────────────────────────
  const fetchMaintenanceLogs = useCallback(async () => {
    try {
      const data = await MaintenanceService.getMaintenanceLogs(1, 50);
      if (data?.logs) {
        setMaintenanceLogs(
          data.logs.map(log => ({
            id: log._id,
            equipment: log.equipmentId?.name || 'Unknown',
            type: log.type || 'preventive',
            technician: log.technicianName || 'N/A',
            date: log.date ? new Date(log.date).toLocaleDateString() : 'N/A',
            cost: `₹${(log.cost || 0).toLocaleString()}`,
            status: log.status || 'pending',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching maintenance logs:', err.message);
      // Don't set error state - maintenance logs are optional
      setMaintenanceLogs([]);
    }
  }, []);

  // ─── FETCH INTEGRATIONS ───────────────────────────────────────────────────
  const fetchIntegrations = useCallback(async () => {
    try {
      const data = await IntegrationService.getIntegrations();
      if (data?.integrations) {
        setIntegrations(
          data.integrations.map(integration => ({
            id: integration._id,
            name: integration.name,
            category: integration.category || 'Other',
            description: integration.description || '',
            enabled: integration.isEnabled || false,
            icon: integration.icon || '🔌',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching integrations:', err.message);
      // Don't set error state - integrations are optional
      setIntegrations([]);
    }
  }, []);

  // ─── FETCH FEATURE FLAGS ──────────────────────────────────────────────────
  const fetchFeatureFlags = useCallback(async () => {
    try {
      const data = await AdvancedService.getFeatureFlags();
      if (data?.flags) {
        setFeatureFlags(
          data.flags.map(flag => ({
            id: flag._id,
            name: flag.name,
            key: flag.key,
            description: flag.description || '',
            env: flag.environment || 'production',
            enabled: flag.isEnabled || false,
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching feature flags:', err.message);
      // Don't set error state - feature flags are optional
      setFeatureFlags([]);
    }
  }, []);

  // ─── FETCH LIVE MONITORING ────────────────────────────────────────────────
  const fetchLiveMonitoring = useCallback(async () => {
    try {
      const data = await AdvancedService.getLiveMonitoring();
      if (data) {
        setLiveMonitoring({
          activeUsers: data.activeUsers || 0,
          checkInsToday: data.checkInsToday || 0,
          peakHour: data.peakHour || 'N/A',
          currentLoad: data.currentLoad || 0,
          branchLive: (data.branchLive || []).map(b => ({
            branch: b.branchName || 'Unknown',
            active: b.activeUsers || 0,
            checkins: b.checkInsToday || 0,
          })),
        });
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching live monitoring:', err.message);
      // Don't set error state - live monitoring is optional
      setLiveMonitoring([]);
    }
  }, []);

  // ─── FETCH AI INSIGHTS ────────────────────────────────────────────────────
  const fetchAiInsights = useCallback(async () => {
    try {
      const data = await AdvancedService.getAIInsights();
      if (data?.insights) {
        setAiInsights(
          data.insights.map(insight => ({
            id: insight._id,
            title: insight.title,
            insight: insight.description || insight.insight,
            type: insight.type || 'info',
            action: insight.recommendedAction || 'View Details',
            icon: insight.icon || '💡',
          }))
        );
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching AI insights:', err.message);
      // Don't set error state - AI insights are optional
      setAiInsights([]);
    }
  }, []);

  // ─── FETCH SUBSCRIPTIONS ──────────────────────────────────────────────────
  const fetchSubscriptions = useCallback(async () => {
    try {
      const data = await BillingService.getSubscriptions(1, 50);
      if (data?.subscriptions && Array.isArray(data.subscriptions)) {
        setSubscriptions(
          data.subscriptions.map(sub => ({
            id: sub?._id || Math.random(),
            user: sub?.userId?.fullName || 'Unknown',
            plan: sub?.planId?.name || 'Unknown',
            start: sub?.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A',
            expiry: sub?.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A',
            daysLeft: sub?.daysRemaining || 0,
            status: sub?.status || 'active',
          }))
        );
      } else {
        setSubscriptions([]);
      }
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error fetching subscriptions:', err.message);
      // Don't set error state - subscriptions are optional
      setSubscriptions([]);
    }
  }, []);

  // ─── INITIALIZE ALL DATA ──────────────────────────────────────────────────
  const initializeData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      // Core data (required for dashboard to work)
      try {
        await Promise.all([
          fetchOverview(),
          fetchUsers(),
          fetchBranches(),
          fetchMembershipPlans(),
          fetchNotifications(),
        ]);
      } catch (coreErr) {
        console.error('❌ [useSuperAdminDashboard] Core data fetch failed:', coreErr.message);
        setError('Failed to load dashboard overview');
        setLoading(false);
        return;
      }

      // Optional data (won't crash dashboard if they fail)
      await Promise.allSettled([
        fetchTransactions(),
        fetchCampaigns(),
        fetchSupportTickets(),
        fetchAuditLogs(),
        fetchLoginHistory(),
        fetchSettings(),
        fetchSystemLogs(),
        fetchFeedbackData(),
        fetchEquipment(),
        fetchVendors(),
        fetchMaintenanceLogs(),
        fetchIntegrations(),
        fetchFeatureFlags(),
        fetchLiveMonitoring(),
        fetchAiInsights(),
        fetchSubscriptions(),
      ]);

      console.log('✅ [useSuperAdminDashboard] All data loaded successfully');
    } catch (err) {
      console.error('❌ [useSuperAdminDashboard] Error initializing dashboard data:', err.message);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [
    fetchOverview,
    fetchUsers,
    fetchBranches,
    fetchMembershipPlans,
    fetchNotifications,
    fetchTransactions,
    fetchCampaigns,
    fetchSupportTickets,
    fetchAuditLogs,
    fetchLoginHistory,
    fetchSettings,
    fetchSystemLogs,
    fetchFeedbackData,
    fetchEquipment,
    fetchVendors,
    fetchMaintenanceLogs,
    fetchIntegrations,
    fetchFeatureFlags,
    fetchLiveMonitoring,
    fetchAiInsights,
    fetchSubscriptions,
  ]);

  // ─── EFFECT: LOAD DATA ON MOUNT ────────────────────────────────────────────
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // ─── RETURN STATE AND FUNCTIONS ────────────────────────────────────────────
  return {
    // Data
    globalStats,
    branches,
    allUsers,
    membershipPlans,
    financialReports,
    transactions,
    notifications,
    campaigns,
    supportTickets,
    memberGrowth,
    auditLog,
    loginHistory,
    systemLogs,
    feedbackData,
    equipment,
    vendors,
    maintenanceLogs,
    integrations,
    featureFlags,
    liveMonitoring,
    aiInsights,
    systemSettings,
    subscriptions,

    // Status
    loading,
    error,

    // Functions
    refetch: initializeData,
    fetchOverview,
    fetchUsers,
    fetchBranches,
    fetchMembershipPlans,
    fetchNotifications,
    fetchTransactions,
    fetchCampaigns,
    fetchSupportTickets,
    fetchAuditLogs,
    fetchLoginHistory,
    fetchSettings,
    fetchSystemLogs,
    fetchFeedbackData,
    fetchEquipment,
    fetchVendors,
    fetchMaintenanceLogs,
    fetchIntegrations,
    fetchFeatureFlags,
    fetchLiveMonitoring,
    fetchAiInsights,
    fetchSubscriptions,
  };
};

export default useSuperAdminDashboard;
