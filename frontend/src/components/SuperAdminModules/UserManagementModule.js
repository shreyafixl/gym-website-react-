import React, { useState, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaSync, FaDownload } from 'react-icons/fa';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { useCreateUser, useUpdateUser, useDeleteUser } from '../../hooks/useSuperAdminMutations';
import LoadingSpinner from '../LoadingSpinner';
import ErrorAlert from '../ErrorAlert';
import SuccessAlert from '../SuccessAlert';
import FormModal from '../FormModal';
import { transformUserData, formatDate, formatPhoneNumber } from '../../utils/apiUtils';

const UserManagementModule = () => {
  const {
    users,
    usersLoading,
    usersError,
    usersPagination,
    fetchUsers,
  } = useSuperAdmin();

  const { mutate: createUser, loading: createLoading, error: createError, success: createSuccess } = useCreateUser();
  const { mutate: updateUser, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateUser();
  const { mutate: deleteUser, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((type, value) => {
    if (type === 'role') setFilterRole(value);
    if (type === 'status') setFilterStatus(value);
    setCurrentPage(1);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchUsers(currentPage, 10, { role: filterRole, status: filterStatus });
  }, [fetchUsers, currentPage, filterRole, filterStatus]);

  const handleCreateUser = useCallback(async (formData) => {
    try {
      await createUser(formData);
      setSuccessMessage('User created successfully');
      setShowModal(false);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to create user');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [createUser, handleRefresh]);

  const handleUpdateUser = useCallback(async (formData) => {
    try {
      await updateUser(editingUser._id, formData);
      setSuccessMessage('User updated successfully');
      setShowModal(false);
      setEditingUser(null);
      handleRefresh();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update user');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  }, [updateUser, editingUser, handleRefresh]);

  const handleDeleteUser = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setSuccessMessage('User deleted successfully');
        handleRefresh();
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        setErrorMessage(error.message || 'Failed to delete user');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  }, [deleteUser, handleRefresh]);

  const handleEditUser = useCallback((user) => {
    setEditingUser(user);
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingUser(null);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    const matchesStatus = !filterStatus || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (usersLoading) return <LoadingSpinner />;

  return (
    <div className="module-container">
      {successMessage && <SuccessAlert message={successMessage} />}
      {errorMessage && <ErrorAlert message={errorMessage} />}
      {usersError && <ErrorAlert message={usersError} />}

      <div className="module-header">
        <h2>User Management</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <FaPlus /> Add User
        </button>
      </div>

      <div className="module-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-group">
          <select value={filterRole} onChange={(e) => handleFilterChange('role', e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
            <option value="member">Member</option>
          </select>

          <select value={filterStatus} onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn btn-secondary" onClick={handleRefresh} disabled={usersLoading}>
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id || user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatPhoneNumber(user.phone)}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td><span className={`status ${user.status}`}>{user.status}</span></td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td className="actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => handleEditUser(user)}
                      disabled={updateLoading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDeleteUser(user._id || user.id)}
                      disabled={deleteLoading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-state">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {Math.ceil(usersPagination.total / 10)}</span>
        <button
          disabled={currentPage >= Math.ceil(usersPagination.total / 10)}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {showModal && (
        <FormModal
          title={editingUser ? 'Edit User' : 'Create User'}
          onClose={handleCloseModal}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          loading={editingUser ? updateLoading : createLoading}
          fields={[
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'phone', label: 'Phone', type: 'tel', required: false },
            { name: 'role', label: 'Role', type: 'select', options: ['admin', 'trainer', 'member'], required: true },
            { name: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'], required: true },
          ]}
          initialData={editingUser}
        />
      )}
    </div>
  );
};

export default UserManagementModule;
