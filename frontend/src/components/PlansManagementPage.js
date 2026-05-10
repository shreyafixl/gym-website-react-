import React, { useEffect, useState, useCallback } from 'react';
import {
  FaTag,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
  FaStar,
} from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import PlansService from '../services/superadmin/PlansService';
import PlansManagementForm from './PlansManagementForm';
import '../styles/user-management.css';

/**
 * Plans Management Page Component
 * Comprehensive plans management with CRUD operations, validation, and error handling
 */
const PlansManagementPage = () => {
  // CRUD operations hook
  const crud = useCRUDOperations(PlansService);

  // Local state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

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
        filters: { isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined },
      });
    } catch (error) {
      showNotification('Failed to load plans', 'error');
    }
  }, [statusFilter]);

  // Filter and paginate plans
  const filteredPlans = crud.data.filter((plan) => {
    const matchesSearch =
      plan.name?.toLowerCase().includes(search.toLowerCase()) ||
      plan.code?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && plan.isActive) ||
      (statusFilter === 'inactive' && !plan.isActive);
    return matchesSearch && matchesStatus;
  });

  const paginatedPlans = filteredPlans.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredPlans.length / ITEMS_PER_PAGE);

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
          <FaTag className="header-icon" />
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
        </div>
      </div>

      {/* Filters */}
      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by plan name or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
        <div className="role-filters">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
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
          <FaTag className="empty-icon" />
          <h3>No plans found</h3>
          <p>Get started by creating your first plan</p>
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

      {/* Plans Table */}
      {!crud.loading && paginatedPlans.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Popular</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="cell-name">
                    <strong>{plan.name}</strong>
                  </td>
                  <td className="cell-email">{plan.code}</td>
                  <td className="cell-email">₹{parseFloat(plan.price).toLocaleString()}</td>
                  <td className="cell-email">
                    {plan.duration} {plan.durationLabel}
                  </td>
                  <td className="cell-email">
                    {plan.isPopular ? (
                      <FaStar style={{ color: '#f59e0b' }} />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="cell-status">
                    <span className={`badge badge-${plan.isActive ? 'active' : 'inactive'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Plans Form Modal */}
      <PlansManagementForm
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
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?
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

export default PlansManagementPage;
