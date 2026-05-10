import { useState } from 'react';
import { FaUsers, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import adminService from '../../services/adminService';
import { useAdminPaginatedData, useAdminCRUD } from '../../hooks/useAdminData';

// Reusable components
const ABadge = ({ status }) => {
  const statusClasses = {
    active: "ad-green",
    expired: "ad-red", 
    suspended: "ad-yellow",
    inactive: "ad-gray",
    new: "ad-blue",
    contacted: "ad-yellow", 
    converted: "ad-green",
    not_interested: "ad-gray"
  };
  
  return (
    <span className={`ad-badge ${statusClasses[status] || "ad-gray"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
};

const EmptyState = ({ icon = "📭", title = "No data found", desc = "Nothing to display here yet." }) => (
  <div className="ad-empty">
    <div className="ad-empty-icon">{icon}</div>
    <h4>{title}</h4>
    <p>{desc}</p>
  </div>
);

const LoadingSpinner = () => (
  <div style={{ textAlign: 'center', padding: '40px' }}>
    <div className="ad-spinner" />
    <p style={{ marginTop: '10px', color: 'var(--text-secondary)' }}>Loading users...</p>
  </div>
);

const Pagination = ({ pagination, onPageChange }) => {
  if (pagination.totalPages <= 1) return null;
  
  return (
    <div className="ad-pagination">
      <button 
        disabled={pagination.currentPage === 1} 
        onClick={() => onPageChange(pagination.currentPage - 1)} 
        className="ad-page-btn"
      >
        ‹
      </button>
      {Array.from({ length: pagination.totalPages }, (_, i) => (
        <button 
          key={i} 
          className={`ad-page-btn ${pagination.currentPage === i+1 ? "ad-page-active" : ""}`} 
          onClick={() => onPageChange(i+1)}
        >
          {i+1}
        </button>
      ))}
      <button 
        disabled={pagination.currentPage === pagination.totalPages} 
        onClick={() => onPageChange(pagination.currentPage + 1)} 
        className="ad-page-btn"
      >
        ›
      </button>
    </div>
  );
};

const UserModal = ({ user, onClose, onSave, mode = 'view' }) => {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    age: user?.age || '',
    role: user?.role || 'member',
    isActive: user?.isActive !== false,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="ad-modal-overlay" onClick={onClose}>
      <div className="ad-modal" onClick={e => e.stopPropagation()}>
        <div className="ad-modal-head">
          <h3>
            {mode === 'view' ? 'User Details' : 
             mode === 'edit' ? 'Edit User' : 'Add New User'}
          </h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="ad-modal-body">
          {mode === 'view' ? (
            <div className="ad-member-detail-grid">
              {[
                ["Name", user?.fullName || '—'],
                ["Email", user?.email || '—'],
                ["Phone", user?.phone || '—'],
                ["Gender", user?.gender || '—'],
                ["Age", user?.age || '—'],
                ["Role", user?.role || '—'],
                ["Status", user?.isActive ? 'Active' : 'Inactive'],
                ["Joined", user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'],
              ].map(([label, value]) => (
                <div key={label} className="ad-detail-row">
                  <span className="ad-detail-label">{label}</span>
                  <span className="ad-detail-val">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="ad-form-grid">
                {[
                  ["Full Name", "fullName", "text"],
                  ["Email", "email", "email"],
                  ["Phone", "phone", "tel"],
                ].map(([label, name, type]) => (
                  <div className="ad-form-group" key={name}>
                    <label>{label}</label>
                    <input
                      className="ad-input"
                      type={type}
                      name={name}
                      value={formData[name]}
                      onChange={handleChange}
                      required={name === 'fullName' || name === 'email'}
                      disabled={mode === 'edit' && name === 'email'}
                    />
                  </div>
                ))}

                <div className="ad-form-group">
                  <label>Gender</label>
                  <select className="ad-input" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="ad-form-group">
                  <label>Age</label>
                  <input
                    className="ad-input"
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="16"
                    max="100"
                  />
                </div>

                <div className="ad-form-group">
                  <label>Role</label>
                  <select className="ad-input" name="role" value={formData.role} onChange={handleChange}>
                    <option value="member">Member</option>
                    <option value="trainer">Trainer</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <div className="ad-form-group">
                  <label className="ad-checkbox-label">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleChange}
                    />
                    <span>Active</span>
                  </label>
                </div>
              </div>

              <div className="ad-form-actions">
                <button type="button" className="btn btn-outline" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (mode === 'edit' ? 'Update User' : 'Create User')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const AdminUserManagement = ({ openForm }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    membershipStatus: '',
    membershipPlan: '',
    gender: '',
    isActive: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'add'

  // Fetch paginated users
  const { items: users, pagination, loading, error, updateParams, refresh } = useAdminPaginatedData(
    adminService.users.getAll,
    {
      search,
      ...filters,
      limit: 6,
    }
  );

  // CRUD operations
  const { create, update, deleteItem, loading: crudLoading } = useAdminCRUD({
    create: adminService.users.create,
    update: adminService.users.update,
    delete: adminService.users.delete,
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    updateParams({ [key]: value, page: 1 });
  };

  const handleSearch = (value) => {
    setSearch(value);
    updateParams({ search: value, page: 1 });
  };

  const handlePageChange = (page) => {
    updateParams({ page });
  };

  const handleUserAction = async (action, user) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setModalMode('view');
        break;
      
      case 'edit':
        setSelectedUser(user);
        setModalMode('edit');
        break;
      
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
          try {
            await deleteItem(user._id);
            refresh();
          } catch (error) {
            console.error('Failed to delete user:', error);
          }
        }
        break;
      
      case 'toggleStatus':
        try {
          await update(user._id, { isActive: !user.isActive });
          refresh();
        } catch (error) {
          console.error('Failed to toggle user status:', error);
        }
        break;
    }
  };

  const handleSaveUser = async (userData) => {
    if (modalMode === 'add') {
      await create(userData);
    } else if (modalMode === 'edit') {
      await update(selectedUser._id, userData);
    }
    refresh();
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setModalMode('add');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalMode('view');
  };

  return (
    <div className="ad-section">
      <div className="ad-section-head">
        <h2>👥 All Members</h2>
        <div className="ad-head-actions">
          <button className="btn btn-primary ad-btn-sm" onClick={handleAddNew}>
            <FaPlus /> Add Member
          </button>
          <button className="btn btn-outline ad-btn-sm" onClick={() => console.log('Export functionality coming soon')}>
            ⬇ Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="ad-filters">
        <div className="ad-search-box">
          <FaSearch className="ad-search-icon" />
          <input
            className="ad-input"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ maxWidth: 220 }}
          />
        </div>

        <div className="ad-filter-group">
          <span className="ad-filter-label">Role:</span>
          {['all', 'member', 'trainer', 'staff'].map(role => (
            <button
              key={role}
              className={`ad-filter-btn ${filters.role === role ? "ad-filter-active" : ""}`}
              onClick={() => handleFilterChange('role', role === 'all' ? '' : role)}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="ad-filter-group">
          <span className="ad-filter-label">Status:</span>
          {['all', 'active', 'inactive'].map(status => (
            <button
              key={status}
              className={`ad-filter-btn ${filters.isActive === (status === 'all' ? '' : status === 'active') ? "ad-filter-active" : ""}`}
              onClick={() => handleFilterChange('isActive', status === 'all' ? '' : status === 'active')}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="ad-card">
        <div className="ad-card-head">
          <h3>
            Showing {pagination.totalItems} users
            {search && ` matching "${search}"`}
          </h3>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="ad-error-banner">
            <span>⚠️ Error loading users: {error}</span>
            <button onClick={refresh} className="ad-btn-sm">Retry</button>
          </div>
        ) : users.length === 0 ? (
          <EmptyState 
            title="No users found" 
            desc="Try adjusting your search or filters." 
          />
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
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
                {users.map(user => (
                  <tr key={user._id}>
                    <td><strong>{user.fullName}</strong></td>
                    <td style={{ fontSize: ".8rem" }}>{user.email}</td>
                    <td>{user.phone || '—'}</td>
                    <td><ABadge status={user.role} /></td>
                    <td>
                      <ABadge status={user.isActive ? 'active' : 'inactive'} />
                    </td>
                    <td>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button 
                          className="ad-link-btn" 
                          onClick={() => handleUserAction('view', user)}
                        >
                          View
                        </button>
                        <button 
                          className="ad-link-btn" 
                          onClick={() => handleUserAction('edit', user)}
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className="ad-link-btn" 
                          style={{ color: user.isActive ? "#ef4444" : "#22c55e" }}
                          onClick={() => handleUserAction('toggleStatus', user)}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="ad-link-btn" 
                          style={{ color: "#ef4444" }}
                          onClick={() => handleUserAction('delete', user)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination 
          pagination={pagination} 
          onPageChange={handlePageChange}
        />
      </div>

      {/* User Modal */}
      {selectedUser !== null && (
        <UserModal
          user={selectedUser}
          mode={modalMode}
          onClose={closeModal}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default AdminUserManagement;
