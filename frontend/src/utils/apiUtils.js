/**
 * API Utilities
 * Formatting, transformation, and helper functions for API data
 */

/**
 * Format currency values
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (!value && value !== 0) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Format date values
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '-';
  const dateObj = new Date(date);
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } else if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } else if (format === 'time') {
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (format === 'datetime') {
    return dateObj.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return dateObj.toLocaleDateString();
};

/**
 * Format number values
 */
export const formatNumber = (value, decimals = 0) => {
  if (!value && value !== 0) return '-';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

/**
 * Format percentage values
 */
export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return '-';
  return `${formatNumber(value, decimals)}%`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

/**
 * Format status badge
 */
export const formatStatus = (status) => {
  const statusMap = {
    active: { label: 'Active', color: 'success' },
    inactive: { label: 'Inactive', color: 'danger' },
    pending: { label: 'Pending', color: 'warning' },
    completed: { label: 'Completed', color: 'success' },
    cancelled: { label: 'Cancelled', color: 'danger' },
    expired: { label: 'Expired', color: 'danger' },
    renewed: { label: 'Renewed', color: 'success' },
    suspended: { label: 'Suspended', color: 'warning' },
    verified: { label: 'Verified', color: 'success' },
    unverified: { label: 'Unverified', color: 'warning' },
  };
  return statusMap[status?.toLowerCase()] || { label: status, color: 'secondary' };
};

/**
 * Transform user data from API
 */
export const transformUserData = (user) => {
  if (!user) return null;
  return {
    id: user._id || user.id,
    name: user.name || user.fullName || '-',
    email: user.email || '-',
    phone: formatPhoneNumber(user.phone),
    role: user.role || 'member',
    status: user.status || user.isActive ? 'active' : 'inactive',
    joinDate: formatDate(user.createdAt || user.joinDate),
    avatar: user.avatar || user.profilePicture || null,
    branch: user.branch?.name || user.branchName || '-',
    membership: user.membership?.plan?.name || user.membershipPlan || '-',
    lastLogin: formatDate(user.lastLogin, 'datetime'),
    verified: user.isEmailVerified || user.emailVerified || false,
    ...user,
  };
};

/**
 * Transform branch data from API
 */
export const transformBranchData = (branch) => {
  if (!branch) return null;
  return {
    id: branch._id || branch.id,
    name: branch.name || '-',
    code: branch.code || '-',
    city: branch.city || '-',
    address: branch.address || '-',
    phone: formatPhoneNumber(branch.phone),
    email: branch.email || '-',
    status: branch.status || 'active',
    manager: branch.manager?.name || branch.managerName || '-',
    capacity: branch.capacity || 0,
    members: branch.memberCount || 0,
    trainers: branch.trainerCount || 0,
    operatingHours: branch.operatingHours || '-',
    amenities: branch.amenities || [],
    coordinates: branch.coordinates || null,
    createdAt: formatDate(branch.createdAt),
    ...branch,
  };
};

/**
 * Transform membership data from API
 */
export const transformMembershipData = (membership) => {
  if (!membership) return null;
  return {
    id: membership._id || membership.id,
    memberId: membership.memberId || membership.userId || '-',
    memberName: membership.member?.name || membership.memberName || '-',
    planName: membership.plan?.name || membership.planName || '-',
    planPrice: formatCurrency(membership.plan?.price || membership.price),
    status: membership.status || 'active',
    startDate: formatDate(membership.startDate),
    endDate: formatDate(membership.endDate),
    daysRemaining: calculateDaysRemaining(membership.endDate),
    autoRenew: membership.autoRenew || false,
    branch: membership.branch?.name || membership.branchName || '-',
    createdAt: formatDate(membership.createdAt),
    ...membership,
  };
};

/**
 * Transform trainer data from API
 */
export const transformTrainerData = (trainer) => {
  if (!trainer) return null;
  return {
    id: trainer._id || trainer.id,
    name: trainer.name || trainer.fullName || '-',
    email: trainer.email || '-',
    phone: formatPhoneNumber(trainer.phone),
    specialization: trainer.specialization || '-',
    experience: trainer.experience || 0,
    certification: trainer.certification || '-',
    branch: trainer.branch?.name || trainer.branchName || '-',
    status: trainer.status || 'active',
    members: trainer.memberCount || 0,
    rating: trainer.rating || 0,
    avatar: trainer.avatar || trainer.profilePicture || null,
    joinDate: formatDate(trainer.createdAt || trainer.joinDate),
    ...trainer,
  };
};

/**
 * Transform attendance data from API
 */
export const transformAttendanceData = (attendance) => {
  if (!attendance) return null;
  return {
    id: attendance._id || attendance.id,
    memberId: attendance.memberId || attendance.userId || '-',
    memberName: attendance.member?.name || attendance.memberName || '-',
    date: formatDate(attendance.date),
    checkInTime: formatDate(attendance.checkInTime, 'time'),
    checkOutTime: formatDate(attendance.checkOutTime, 'time'),
    duration: calculateDuration(attendance.checkInTime, attendance.checkOutTime),
    branch: attendance.branch?.name || attendance.branchName || '-',
    status: attendance.status || 'present',
    ...attendance,
  };
};

/**
 * Transform workout data from API
 */
export const transformWorkoutData = (workout) => {
  if (!workout) return null;
  return {
    id: workout._id || workout.id,
    name: workout.name || '-',
    description: workout.description || '-',
    type: workout.type || '-',
    duration: workout.duration || 0,
    difficulty: workout.difficulty || 'medium',
    trainer: workout.trainer?.name || workout.trainerName || '-',
    members: workout.memberCount || 0,
    schedule: workout.schedule || '-',
    status: workout.status || 'active',
    createdAt: formatDate(workout.createdAt),
    ...workout,
  };
};

/**
 * Transform notification data from API
 */
export const transformNotificationData = (notification) => {
  if (!notification) return null;
  return {
    id: notification._id || notification.id,
    title: notification.title || '-',
    message: notification.message || '-',
    type: notification.type || 'info',
    recipientCount: notification.recipientCount || 0,
    sentAt: formatDate(notification.sentAt, 'datetime'),
    status: notification.status || 'sent',
    ...notification,
  };
};

/**
 * Transform campaign data from API
 */
export const transformCampaignData = (campaign) => {
  if (!campaign) return null;
  return {
    id: campaign._id || campaign.id,
    name: campaign.name || '-',
    description: campaign.description || '-',
    type: campaign.type || 'email',
    status: campaign.status || 'draft',
    startDate: formatDate(campaign.startDate),
    endDate: formatDate(campaign.endDate),
    targetAudience: campaign.targetAudience || '-',
    recipientCount: campaign.recipientCount || 0,
    openRate: formatPercentage(campaign.openRate),
    clickRate: formatPercentage(campaign.clickRate),
    conversionRate: formatPercentage(campaign.conversionRate),
    createdAt: formatDate(campaign.createdAt),
    ...campaign,
  };
};

/**
 * Transform support ticket data from API
 */
export const transformTicketData = (ticket) => {
  if (!ticket) return null;
  return {
    id: ticket._id || ticket.id,
    ticketId: ticket.ticketId || ticket.id,
    title: ticket.title || '-',
    description: ticket.description || '-',
    category: ticket.category || '-',
    priority: ticket.priority || 'medium',
    status: ticket.status || 'open',
    createdBy: ticket.createdBy?.name || ticket.createdByName || '-',
    assignedTo: ticket.assignedTo?.name || ticket.assignedToName || '-',
    createdAt: formatDate(ticket.createdAt, 'datetime'),
    updatedAt: formatDate(ticket.updatedAt, 'datetime'),
    responseCount: ticket.responseCount || 0,
    ...ticket,
  };
};

/**
 * Calculate days remaining until date
 */
export const calculateDaysRemaining = (endDate) => {
  if (!endDate) return 0;
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

/**
 * Calculate duration between two times
 */
export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return '-';
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end - start;
  const diffMins = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Parse API error message
 */
export const parseErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An error occurred. Please try again.';
};

/**
 * Build query string from filters
 */
export const buildQueryString = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      params.append(key, value);
    }
  });
  return params.toString();
};

/**
 * Paginate array
 */
export const paginateArray = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      current_page: page,
      per_page: limit,
      total_count: array.length,
      total_pages: Math.ceil(array.length / limit),
    },
  };
};

/**
 * Filter array by search term
 */
export const filterBySearchTerm = (array, searchTerm, searchFields = ['name', 'email']) => {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter((item) =>
    searchFields.some((field) =>
      String(item[field] || '').toLowerCase().includes(term)
    )
  );
};

/**
 * Sort array
 */
export const sortArray = (array, sortBy = 'name', sortOrder = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Group array by field
 */
export const groupByField = (array, field) => {
  return array.reduce((groups, item) => {
    const key = item[field];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
};

/**
 * Calculate statistics
 */
export const calculateStats = (array, field) => {
  if (!array || array.length === 0) {
    return { total: 0, average: 0, min: 0, max: 0 };
  }
  
  const values = array.map((item) => Number(item[field]) || 0);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  return { total, average, min, max };
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      }).join(',')
    ),
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Export data to JSON
 */
export const exportToJSON = (data, filename = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone.replace(/\D/g, ''));
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export default {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatStatus,
  transformUserData,
  transformBranchData,
  transformMembershipData,
  transformTrainerData,
  transformAttendanceData,
  transformWorkoutData,
  transformNotificationData,
  transformCampaignData,
  transformTicketData,
  calculateDaysRemaining,
  calculateDuration,
  parseErrorMessage,
  buildQueryString,
  paginateArray,
  filterBySearchTerm,
  sortArray,
  groupByField,
  calculateStats,
  exportToCSV,
  exportToJSON,
  validateEmail,
  validatePhoneNumber,
  debounce,
  throttle,
};
