import React, { useEffect, useState, useCallback } from 'react';
import {
  FaUsers,
  FaPlus,
  FaDownload,
  FaSearch,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaExclamationCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import UserService from '../services/superadmin/UserService';
import UserManagementForm from './UserManagementForm';
import '../styles/user-management.css';

/**
 * User Management Page Component
 * Comprehensive user management with CRUD operations, validation, and error handling
 */
const UserManagementPage = ({ branches = [] }) => {
  // CRUD operations hook
  const crud = useCRUDOperations(UserService);

  // Local state
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Load users from backend
  const loadUsers = useCallback(async () => {
    try {
      await crud.fetchAll({
        page: 1,
        perPage: 100,
        filters: { role: roleFilter !== 'all' ? roleFilter : undefined },
      });
    } catch (error) {
      showNotification('Failed to load users', 'error');
    }
  }, [roleFilter]);

  // Filter and paginate users
  const filteredUsers = crud.data.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle create user
  const handleCreateUser = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingUser(null);
      showNotification('User created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create user', 'error');
      throw error;
    }
  };

  // Handle edit user
  const handleEditUser = async (user) => {
    try {
      await crud.fetchById(user.id);
      setEditingUser(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load user details', 'error');
    }
  };

  // Handle update user
  const handleUpdateUser = async (formData) => {
    try {
      await crud.update(editingUser.id, formData);
      setIsFormOpen(false);
      setEditingUser(null);
      showNotification('User updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update user', 'error');
      throw error;
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId) => {
    try {
      await crud.delete(userId);
      setDeleteConfirm(null);
      showNotification('User deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete user', 'error');
    }
  };

  // Handle export users
  const handleExportUsers = async () => {
    try {
      const blob = await UserService.exportUsers('csv');
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showNotification('Users exported successfully', 'success');
    } catch (error) {
      showNotification('Failed to export users', 'error');
    }
  };

  // Handle form close
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  // Handle form submit
  const handleFormSubmit = async (formData) => {
    if (editingUser) {
      await handleUpdateUser(formData);
    } else {
      await handleCreateUser(formData);
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
          <FaUsers className="header-icon" />
          <h1>User Management</h1>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            disabled={crud.loading}
          >
            <FaPlus /> Add User
          </button>
          <button
            className="btn btn-outline"
            onClick={handleExportUsers}
            disabled={crud.loading || crud.data.length === 0}
          >
            <FaDownload /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />
        </div>
        <div className="role-filters">
          {['all', 'member', 'trainer', 'admin', 'superadmin'].map((role) => (
            <button
              key={role}
              className={`filter-btn ${roleFilter === role ? 'active' : ''}`}
              onClick={() => {
                setRoleFilter(role);
                setPage(1);
              }}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaUsers className="empty-icon" />
          <h3>No users found</h3>
          <p>Get started by creating your first user</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
          >
            <FaPlus /> Create User
          </button>
        </div>
      )}

      {/* Users Table */}
      {!crud.loading && paginatedUsers.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="cell-name">
                    <strong>{user.name}</strong>
                  </td>
                  <td className="cell-email">{user.email}</td>
                  <td className="cell-role">
                    <span className={`badge badge-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="cell-branch">{user.branch || '-'}</td>
                  <td className="cell-status">
                    <span className={`badge badge-${user.status}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="cell-last-login">
                    {user.lastLogin || 'Never'}
                  </td>
                  <td className="cell-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditUser(user)}
                      title="Edit user"
                      disabled={crud.loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => setDeleteConfirm(user)}
                      title="Delete user"
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

      {/* User Form Modal */}
      <UserManagementForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        isLoading={crud.loading}
        error={crud.error}
        editingUser={editingUser}
        branches={branches}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div
            className="confirmation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Delete User</h3>
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
                onClick={() => handleDeleteUser(deleteConfirm.id)}
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

export default UserManagementPage;
