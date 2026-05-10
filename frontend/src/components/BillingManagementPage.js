import React, { useEffect, useState, useCallback } from 'react';
import {
  FaFileInvoice,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import BillingService from '../services/superadmin/BillingService';
import BillingManagementForm from './BillingManagementForm';
import '../styles/user-management.css';

/**
 * Billing Management Page Component
 * Comprehensive billing management with CRUD operations, validation, and error handling
 */
const BillingManagementPage = () => {
  // CRUD operations hook
  const crud = useCRUDOperations(BillingService);

  // Local state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBilling, setEditingBilling] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch billing records on component mount
  useEffect(() => {
    loadBilling();
  }, []);

  // Load billing records from backend
  const loadBilling = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
        filters: { status: statusFilter !== 'all' ? statusFilter : undefined },
      });
    } catch (error) {
      showNotification('Failed to load billing records', 'error');
    }
  }, [statusFilter]);

  // Filter and paginate billing records
  const filteredBilling = crud.data.filter((billing) => {
    const matchesSearch =
      billing.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
      billing.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || billing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedBilling = filteredBilling.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBilling.length / ITEMS_PER_PAGE);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle create billing
  const handleCreateBilling = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingBilling(null);
      showNotification('Billing entry created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create billing entry', 'error');
      throw error;
    }
  };

  // Handle edit billing
  const handleEditBilling = async (billing) => {
    try {
      await crud.fetchById(billing.id);
      setEditingBilling(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load billing details', 'error');
    }
  };

  // Handle update billing
  const handleUpdateBilling = async (formData) => {
    try {
      await crud.update(editingBilling.id, formData);
      setIsFormOpen(false);
      setEditingBilling(null);
      showNotification('Billing entry updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update billing entry', 'error');
      throw error;
    }
  };

  // Handle delete billing
  const handleDeleteBilling = async (billingId) => {
    try {
      await crud.delete(billingId);
      setDeleteConfirm(null);
      showNotification('Billing entry deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete billing entry', 'error');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBilling(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    if (editingBilling) {
      await handleUpdateBilling(formData);
    } else {
      await handleCreateBilling(formData);
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
          <FaFileInvoice className="header-icon" />
          <h1>Billing Management</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingBilling(null);
              setIsFormOpen(true);
            }}
            disabled={crud.loading}
          >
            <FaPlus /> Add Billing Entry
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by invoice number or description..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
        <div className="role-filters">
          {['all', 'pending', 'paid', 'overdue', 'cancelled'].map((status) => (
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
          <p>Loading billing records...</p>
        </div>
      )}

      {/* Error State */}
      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadBilling}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaFileInvoice className="empty-icon" />
          <h3>No billing records found</h3>
          <p>Get started by creating your first billing entry</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingBilling(null);
              setIsFormOpen(true);
            }}
          >
            <FaPlus /> Create Billing Entry
          </button>
        </div>
      )}

      {/* Billing Table */}
      {!crud.loading && paginatedBilling.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBilling.map((billing) => (
                <tr key={billing.id}>
                  <td className="cell-name">
                    <strong>{billing.invoiceNumber}</strong>
                  </td>
                  <td className="cell-email">₹{parseFloat(billing.amount).toLocaleString()}</td>
                  <td className="cell-email">{billing.description}</td>
                  <td className="cell-email">
                    {new Date(billing.dueDate).toLocaleDateString()}
                  </td>
                  <td className="cell-status">
                    <span className={`badge badge-${billing.status}`}>
                      {billing.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditBilling(billing)}
                      title="Edit billing"
                      disabled={crud.loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setDeleteConfirm(billing)}
                      title="Delete billing"
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

      {/* Billing Form Modal */}
      <BillingManagementForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={crud.loading}
        error={crud.error}
        editingBilling={editingBilling}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Billing Entry</h3>
            <p>
              Are you sure you want to delete invoice <strong>{deleteConfirm.invoiceNumber}</strong>?
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
                onClick={() => handleDeleteBilling(deleteConfirm.id)}
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

export default BillingManagementPage;
