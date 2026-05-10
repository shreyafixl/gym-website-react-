import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import UserService from '../services/superadmin/UserService';
import usePagination from '../hooks/usePagination';
import useFilters from '../hooks/useFilters';
import useErrorHandler from '../hooks/useErrorHandler';
import useNotification from '../hooks/useNotification';
import useFormSubmit from '../hooks/useFormSubmit';
import {
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSync,
  FaExclamationCircle,
  FaCheckCircle,
  FaSpinner,
  FaTimes,
  FaDownload,
  FaUpload,
} from 'react-icons/fa';
import '../superadmin-dashboard.css';

/**
 * User Management Page
 * Handles CRUD operations for users with pagination and filtering
 */
const UserManagementPage = () => {
  const { user, isLoggedIn } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [searchQuery, setSearchQuery] = useState('');

  const pagination = usePagination(1, 20);
  const filters = useFilters({ role: '', status: '' });
  const errorHandler = useErrorHandler();
  const notification = useNotification();

  // Check authentication
  if (!isLoggedIn || user?.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      errorHandler.clearAllErrors();
      const response = await UserService.getUsers(
        pagination.page,
        pagination.perPage,
        filters.filters
      );
      const data = response.data || response;
      setUsers(data.users || data || []);
      pagination.updateTotal(data.pagination?.total_count || data.total || 0);
    } catch (err) {
      errorHandler.handleError(err);
      notification.showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [pagination, filters, errorHandler, notification]);

  // Load users on mount and when pagination/filters change
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle create user
  const handleCreateUser = useCallback(async (formData) => {
    try {
      const response = await UserService.createUser(formData);
      notification.showSuccess('User created successfully');
      setShowForm(false);
      await fetchUsers();
      return response;
    } catch (err) {
      errorHandler.handleValidationError(err);
      throw err;
    }
  }, [fetchUsers, errorHandler, notification]);

  // Handle update user
  const handleUpdateUser = useCallback(async (formData) => {
    try {
      const response = await UserService.updateUser(selectedUser.id, formData);
      notification.showSuccess('User updated successfully');
      setShowForm(false);
      setSelectedUser(null);
      await fetchUsers();
      return response;
    } catch (err) {
      errorHandler.handleValidationError(err);
      throw err;
    }
  }, [selectedUser, fetchUsers, errorHandler, notification]);

  // Handle delete user
  const handleDeleteUser = useCallback(async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      await UserService.deleteUser(userId);
      notification.showSuccess('User deleted successfully');
      await fetchUsers();
    } catch (err) {
      errorHandler.handleError(err);
      notification.showError('Failed to delete user');
    }
  }, [fetchUsers, errorHandler, notification]);

  // Handle suspend user
  const handleSuspendUser = useCallback(async (userId) => {
    try {
      await UserService.suspendUser(userId, 'Suspended by admin');
      notification.showSuccess('User suspended successfully');
      await fetchUsers();
    } catch (err) {
      errorHandler.handleError(err);
      notification.showError('Failed to suspend user');
    }
  }, [fetchUsers, errorHandler, notification]);

  // Handle reactivate user
  const handleReactivateUser = useCallback(async (userId) => {
    try {
      await UserService.reactivateUser(userId);
      notification.showSuccess('User reactivated successfully');
      await fetchUsers();
    } catch (err) {
      errorHandler.handleError(err);
      notification.showError('Failed to reactivate user');
    }
  }, [fetchUsers, errorHandler, notification]);

  // Handle edit user
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormMode('edit');
    setShowForm(true);
  };

  // Handle create new user
  const handleNewUser = () => {
    setSelectedUser(null);
    setFormMode('create');
    setShowForm(true);
  };

  // Handle search
  const handleSearch = useCallback(async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        setLoading(true);
        const response = await UserService.searchUsers(query, 1, pagination.perPage);
        const data = response.data || response;
        setUsers(data.users || data || []);
        pagination.updateTotal(data.pagination?.total_count || data.total || 0);
      } catch (err) {
        errorHandler.handleError(err);
        notification.showError('Search failed');
      } finally {
        setLoading(false);
      }
    } else {
      await fetchUsers();
    }
  }, [pagination, fetchUsers, errorHandler, notification]);

  // Form submission hook
  const formSubmit = useFormSubmit(
    formMode === 'create' ? handleCreateUser : handleUpdateUser
  );

  // Render loading state
  if (loading && users.length === 0) {
    return (
      <div className="sa-page">
        <div className="sa-loading-container">
          <FaSpinner className="sa-spinner-icon" />
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-page">
      <div className="sa-page-header">
        <div className="sa-page-title">
          <FaUsers className="sa-page-icon" />
          <h1>User Management</h1>
        </div>
        <div className="sa-page-actions">
          <button
            onClick={handleNewUser}
            className="sa-btn sa-btn-primary"
            title="Create new user"
          >
            <FaPlus /> Create User
          </button>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="sa-btn sa-btn-secondary"
            title="Refresh user list"
          >
            <FaSync className={loading ? 'sa-spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification.notifications.map((notif) => (
        <div key={notif.id} className={`sa-alert sa-alert-${notif.type}`}>
          {notif.type === 'success' && <FaCheckCircle />}
          {notif.type === 'error' && <FaExclamationCircle />}
          <span>{notif.message}</span>
          <button
            onClick={() => notification.removeNotification(notif.id)}
            className="sa-alert-close"
          >
            ×
          </button>
        </div>
      ))}

      {/* Errors */}
      {errorHandler.error && (
        <div className="sa-alert sa-alert-error">
          <FaExclamationCircle />
          <span>{errorHandler.error}</span>
          <button
            onClick={errorHandler.clearError}
            className="sa-alert-close"
          >
            ×
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="sa-toolbar">
        <div className="sa-search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="sa-search-input"
          />
        </div>
        <div className="sa-filter-group">
          <select
            value={filters.filters.role || ''}
            onChange={(e) => filters.updateFilter('role', e.target.value)}
            className="sa-filter-select"
          >
            <option value="">All Roles</option>
            <option value="member">Member</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
            <option value="reception">Reception</option>
          </select>
          <select
            value={filters.filters.status || ''}
            onChange={(e) => filters.updateFilter('status', e.target.value)}
            className="sa-filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
          {filters.hasFilters() && (
            <button
              onClick={filters.clearFilters}
              className="sa-btn sa-btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="sa-table-container">
        {users.length === 0 ? (
          <div className="sa-empty-state">
            <FaUsers className="sa-empty-icon" />
            <h3>No users found</h3>
            <p>Create a new user to get started</p>
            <button onClick={handleNewUser} className="sa-btn sa-btn-primary">
              <FaPlus /> Create User
            </button>
          </div>
        ) : (
          <table className="sa-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '-'}</td>
                  <td>
                    <span className={`sa-badge sa-badge-${u.role}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`sa-badge sa-badge-${u.status}`}>
                      {u.status}
                    </span>
                  </td>
                  <td>{new Date(u.joined_at).toLocaleDateString()}</td>
                  <td className="sa-actions">
                    <button
                      onClick={() => handleEditUser(u)}
                      className="sa-btn-icon"
                      title="Edit user"
                    >
                      <FaEdit />
                    </button>
                    {u.status === 'active' ? (
                      <button
                        onClick={() => handleSuspendUser(u.id)}
                        className="sa-btn-icon sa-btn-warning"
                        title="Suspend user"
                      >
                        <FaTimes />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReactivateUser(u.id)}
                        className="sa-btn-icon sa-btn-success"
                        title="Reactivate user"
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="sa-btn-icon sa-btn-danger"
                      title="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="sa-pagination-container">
          <div className="sa-pagination-info">
            Showing {(pagination.page - 1) * pagination.perPage + 1} to{' '}
            {Math.min(pagination.page * pagination.perPage, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          <div className="sa-pagination">
            <button
              onClick={() => pagination.prevPage()}
              disabled={pagination.page === 1}
              className="sa-page-btn"
            >
              ← Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => pagination.goToPage(i + 1)}
                className={`sa-page-btn ${
                  pagination.page === i + 1 ? 'sa-page-active' : ''
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => pagination.nextPage()}
              disabled={pagination.page === pagination.totalPages}
              className="sa-page-btn"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <UserFormModal
          user={selectedUser}
          mode={formMode}
          onSubmit={formSubmit.submit}
          onClose={() => setShowForm(false)}
          loading={formSubmit.loading}
          error={formSubmit.error}
          fieldErrors={errorHandler.errors}
        />
      )}
    </div>
  );
};

/**
 * User Form Modal Component
 */
const UserFormModal = ({
  user,
  mode,
  onSubmit,
  onClose,
  loading,
  error,
  fieldErrors,
}) => {
  const [formData, setFormData] = useState(
    user || {
      name: '',
      email: '',
      phone: '',
      role: 'member',
      status: 'active',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="sa-modal-overlay" onClick={onClose}>
      <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
        <div className="sa-modal-header">
          <h2>{mode === 'create' ? 'Create User' : 'Edit User'}</h2>
          <button onClick={onClose} className="sa-modal-close">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sa-form">
          {error && (
            <div className="sa-alert sa-alert-error">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          <div className="sa-form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={fieldErrors.name ? 'sa-input-error' : ''}
            />
            {fieldErrors.name && (
              <span className="sa-error-text">{fieldErrors.name}</span>
            )}
          </div>

          <div className="sa-form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={fieldErrors.email ? 'sa-input-error' : ''}
            />
            {fieldErrors.email && (
              <span className="sa-error-text">{fieldErrors.email}</span>
            )}
          </div>

          <div className="sa-form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={fieldErrors.phone ? 'sa-input-error' : ''}
            />
            {fieldErrors.phone && (
              <span className="sa-error-text">{fieldErrors.phone}</span>
            )}
          </div>

          <div className="sa-form-row">
            <div className="sa-form-group">
              <label>Role *</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="member">Member</option>
                <option value="trainer">Trainer</option>
                <option value="admin">Admin</option>
                <option value="reception">Reception</option>
              </select>
            </div>

            <div className="sa-form-group">
              <label>Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="sa-form-actions">
            <button
              type="button"
              onClick={onClose}
              className="sa-btn sa-btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="sa-btn sa-btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FaSpinner className="sa-spinning" /> Saving...
                </>
              ) : (
                <>
                  {mode === 'create' ? <FaPlus /> : <FaEdit />}
                  {mode === 'create' ? 'Create' : 'Update'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementPage;
