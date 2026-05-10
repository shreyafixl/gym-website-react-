import React, { useEffect, useState, useCallback } from 'react';
import {
  FaTags,
  FaPlus,
  FaDownload,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaUsers,
} from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import PlansService from '../services/superadmin/PlansService';
import PlansAndPricingForm from './PlansAndPricingForm';
import '../styles/user-management.css';

/**
 * Plans & Pricing Page Component
 * Comprehensive plans and pricing management with CRUD operations
 */
const PlansAndPricingPage = () => {
  // CRUD operations hook
  const crud = useCRUDOperations(PlansService);

  // Local state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Fetch plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  // Load plans from backend
  const loadPlans = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
      });
    } catch (error) {
      showNotification('Failed to load plans', 'error');
    }
  }, []);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle create plan
  const handleCreatePlan = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingPlan(null);
      showNotification('Plan created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create plan', 'error');
      throw error;
    }
  };

  // Handle edit plan
  const handleEditPlan = async (plan) => {
    try {
      await crud.fetchById(plan.id);
      setEditingPlan(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load plan details', 'error');
    }
  };

  // Handle update plan
  const handleUpdatePlan = async (formData) => {
    try {
      await crud.update(editingPlan.id, formData);
      setIsFormOpen(false);
      setEditingPlan(null);
      showNotification('Plan updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update plan', 'error');
      throw error;
    }
  };

  // Handle delete plan
  const handleDeletePlan = async (planId) => {
    try {
      await crud.delete(planId);
      setDeleteConfirm(null);
      showNotification('Plan deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete plan', 'error');
    }
  };

  // Handle export plans
  const handleExportPlans = async () => {
    try {
      const headers = ['Plan Name', 'Price', 'Duration', 'Features', 'Members', 'Status'];
      const rows = crud.data.map(p => [
        p.name,
        p.price,
        p.duration,
        p.features?.join('; ') || '',
        p.members || 0,
        p.status,
      ]);
      
      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `plans-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showNotification('Plans exported successfully', 'success');
    } catch (error) {
      showNotification('Failed to export plans', 'error');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    if (editingPlan) {
      await handleUpdatePlan(formData);
    } else {
      await handleCreatePlan(formData);
    }
  };

  // Calculate statistics
  const stats = {
    totalPlans: crud.data.length,
    activePlans: crud.data.filter(p => p.status === 'active').length,
    totalMembers: crud.data.reduce((sum, p) => sum + (p.members || 0), 0),
    avgPrice: crud.data.length > 0 ? crud.data.reduce((sum, p) => sum + (p.price || 0), 0) / crud.data.length : 0,
  };

  return (
    <div className="user-management-page">
      {/* Notification */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? (
            <FaCheckCircle />
          ) : (
            <FaExclamationCircle />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="user-management-header">
        <div className="header-title">
          <FaTags className="header-icon" />
          <h1>Plans & Pricing</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingPlan(null);
              setIsFormOpen(true);
            }}
            disabled={crud.loading}
          >
            <FaPlus /> Add Plan
          </button>
          <button
            className="btn btn-outline"
            onClick={handleExportPlans}
            disabled={crud.loading || crud.data.length === 0}
          >
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Plans</div>
          <div className="stat-value">{stats.totalPlans}</div>
          <div className="stat-meta">All membership plans</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Plans</div>
          <div className="stat-value">{stats.activePlans}</div>
          <div className="stat-meta">Currently available</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Members</div>
          <div className="stat-value">{stats.totalMembers}</div>
          <div className="stat-meta">Across all plans</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Price</div>
          <div className="stat-value">${stats.avgPrice.toFixed(2)}</div>
          <div className="stat-meta">Per plan</div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => setViewMode('grid')}
        >
          Grid View
        </button>
        <button
          className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
          onClick={() => setViewMode('table')}
        >
          Table View
        </button>
      </div>

      {/* Loading State */}
      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading plans...</p>
        </div>
      )}

      {/* Error State */}
      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadPlans}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaTags className="empty-icon" />
          <h3>No plans found</h3>
          <p>Get started by creating your first membership plan</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingPlan(null);
              setIsFormOpen(true);
            }}
          >
            <FaPlus /> Create Plan
          </button>
        </div>
      )}

      {/* Grid View */}
      {!crud.loading && crud.data.length > 0 && viewMode === 'grid' && (
        <div className="plans-grid">
          {crud.data.map((plan) => (
            <div className="plan-card" key={plan.id}>
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <span className={`badge badge-${plan.status}`}>
                  {plan.status}
                </span>
              </div>
              <div className="plan-price">
                <span className="price">${plan.price}</span>
                <span className="duration">/{plan.duration}</span>
              </div>
              <div className="plan-features">
                <h4>Features:</h4>
                <ul>
                  {(plan.features || []).map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
              </div>
              <div className="plan-members">
                <FaUsers style={{ marginRight: '6px' }} />
                {plan.members || 0} members
              </div>
              <div className="plan-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleEditPlan(plan)}
                  disabled={crud.loading}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: '#ef4444', borderColor: '#ef4444' }}
                  onClick={() => setDeleteConfirm(plan)}
                  disabled={crud.loading}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {!crud.loading && crud.data.length > 0 && viewMode === 'table' && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Features</th>
                <th>Members</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crud.data.map((plan) => (
                <tr key={plan.id}>
                  <td className="cell-name">
                    <strong>{plan.name}</strong>
                  </td>
                  <td className="cell-email">${plan.price}</td>
                  <td className="cell-branch">{plan.duration}</td>
                  <td className="cell-email">
                    {(plan.features || []).slice(0, 2).join(', ')}
                    {(plan.features || []).length > 2 && '...'}
                  </td>
                  <td className="cell-name">{plan.members || 0}</td>
                  <td className="cell-status">
                    <span className={`badge badge-${plan.status}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditPlan(plan)}
                      title="Edit plan"
                      disabled={crud.loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setDeleteConfirm(plan)}
                      title="Delete plan"
                      disabled={crud.loading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Plans Form Modal */}
      <PlansAndPricingForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={crud.loading}
        error={crud.error}
        editingPlan={editingPlan}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Plan</h3>
            <p>
              Are you sure you want to delete the <strong>{deleteConfirm.name}</strong> plan?
              This action cannot be undone.
            </p>
            <div className="confirmation-actions">
              <button
                className="btn btn-outline"
                onClick={() => setDeleteConfirm(null)}
                disabled={crud.loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeletePlan(deleteConfirm.id)}
                disabled={crud.loading}
              >
                {crud.loading ? (
                  <>
                    <FaSpinner className="spinner" /> Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansAndPricingPage;
