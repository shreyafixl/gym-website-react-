import React, { useEffect, useState, useCallback } from 'react';
import {
  FaBuilding,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import BranchService from '../services/superadmin/BranchService';
import BranchManagementForm from './BranchManagementForm';
import '../styles/user-management.css';

/**
 * Branch Management Page Component
 * Comprehensive branch management with CRUD operations, validation, and error handling
 */
const BranchManagementPage = () => {
  // CRUD operations hook
  const crud = useCRUDOperations(BranchService);

  // Local state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch branches on component mount
  useEffect(() => {
    loadBranches();
  }, []);

  // Load branches from backend
  const loadBranches = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
        filters: { status: statusFilter !== 'all' ? statusFilter : undefined },
      });
    } catch (error) {
      showNotification('Failed to load branches', 'error');
    }
  }, [statusFilter]);

  // Filter and paginate branches
  const filteredBranches = crud.data.filter((branch) => {
    const matchesSearch =
      branch.name?.toLowerCase().includes(search.toLowerCase()) ||
      branch.city?.toLowerCase().includes(search.toLowerCase()) ||
      branch.code?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || branch.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedBranches = filteredBranches.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredBranches.length / ITEMS_PER_PAGE);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle create branch
  const handleCreateBranch = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingBranch(null);
      showNotification('Branch created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create branch', 'error');
      throw error;
    }
  };

  // Handle edit branch
  const handleEditBranch = async (branch) => {
    try {
      await crud.fetchById(branch.id);
      setEditingBranch(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load branch details', 'error');
    }
  };

  // Handle update branch
  const handleUpdateBranch = async (formData) => {
    try {
      await crud.update(editingBranch.id, formData);
      setIsFormOpen(false);
      setEditingBranch(null);
      showNotification('Branch updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update branch', 'error');
      throw error;
    }
  };

  // Handle delete branch
  const handleDeleteBranch = async (branchId) => {
    try {
      await crud.delete(branchId);
      setDeleteConfirm(null);
      showNotification('Branch deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete branch', 'error');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingBranch(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    if (editingBranch) {
      await handleUpdateBranch(formData);
    } else {
      await handleCreateBranch(formData);
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
          <FaBuilding className="header-icon" />
          <h1>Branch Management</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingBranch(null);
              setIsFormOpen(true);
            }}
            disabled={crud.loading}
          >
            <FaPlus /> Add Branch
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, city, or code..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
        <div className="role-filters">
          {['all', 'active', 'inactive', 'planned'].map((status) => (
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
          <p>Loading branches...</p>
        </div>
      )}

      {/* Error State */}
      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadBranches}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaBuilding className="empty-icon" />
          <h3>No branches found</h3>
          <p>Get started by creating your first branch</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingBranch(null);
              setIsFormOpen(true);
            }}
          >
            <FaPlus /> Create Branch
          </button>
        </div>
      )}

      {/* Branches Table */}
      {!crud.loading && paginatedBranches.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>City</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((branch) => (
                <tr key={branch.id}>
                  <td className="cell-name">
                    <strong>{branch.name}</strong>
                  </td>
                  <td className="cell-email">{branch.code}</td>
                  <td className="cell-email">{branch.city}</td>
                  <td className="cell-email">{branch.phone || '-'}</td>
                  <td className="cell-email">{branch.email || '-'}</td>
                  <td className="cell-status">
                    <span className={`badge badge-${branch.status}`}>
                      {branch.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditBranch(branch)}
                      title="Edit branch"
                      disabled={crud.loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setDeleteConfirm(branch)}
                      title="Delete branch"
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

      {/* Branch Form Modal */}
      <BranchManagementForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={crud.loading}
        error={crud.error}
        editingBranch={editingBranch}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete Branch</h3>
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
                onClick={() => handleDeleteBranch(deleteConfirm.id)}
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

export default BranchManagementPage;
