import React, { useEffect, useState, useCallback } from 'react';
import { FaTools, FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import useFormValidation from '../hooks/useFormValidation';
import EquipmentService from '../services/superadmin/EquipmentService';
import { required, minLength, combine } from '../utils/validationRules';
import '../styles/user-management.css';
import '../styles/form-modal.css';

const EquipmentForm = ({ isOpen, onClose, onSubmit, isLoading, error, editingEquipment = null }) => {
  const form = useFormValidation(
    {
      name: editingEquipment?.name || '',
      category: editingEquipment?.category || '',
      serialNumber: editingEquipment?.serialNumber || '',
      status: editingEquipment?.status || 'active',
    },
    {
      name: required('Equipment name is required'),
      category: required('Category is required'),
      serialNumber: required('Serial number is required'),
    }
  );

  useEffect(() => {
    if (editingEquipment) {
      form.resetFormWithValues({
        name: editingEquipment.name || '',
        category: editingEquipment.category || '',
        serialNumber: editingEquipment.serialNumber || '',
        status: editingEquipment.status || 'active',
      });
    } else {
      form.resetForm();
    }
  }, [editingEquipment, isOpen]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.resetForm();
  });

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <h2>{editingEquipment ? 'Edit Equipment' : 'Add Equipment'}</h2>
          <button className="form-modal-close" onClick={onClose} disabled={form.isSubmitting}>✕</button>
        </div>
        {error && <div className="form-error-banner"><p>{error}</p></div>}
        <form onSubmit={handleSubmit} className="form-modal-form">
          <div className="form-group">
            <label htmlFor="name">Equipment Name *</label>
            <input id="name" type="text" placeholder="Enter equipment name" {...form.getFieldProps('name')} className={form.getFieldError('name') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('name') && <span className="form-error">{form.getFieldError('name')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <input id="category" type="text" placeholder="Enter category" {...form.getFieldProps('category')} className={form.getFieldError('category') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('category') && <span className="form-error">{form.getFieldError('category')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="serialNumber">Serial Number *</label>
            <input id="serialNumber" type="text" placeholder="Enter serial number" {...form.getFieldProps('serialNumber')} className={form.getFieldError('serialNumber') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('serialNumber') && <span className="form-error">{form.getFieldError('serialNumber')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" {...form.getFieldProps('status')} className="form-input" disabled={form.isSubmitting}>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="retired">Retired</option>
            </select>
          </div>
          <div className="form-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={form.isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
              {form.isSubmitting ? '⏳ Saving...' : (editingEquipment ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EquipmentManagementPage = () => {
  const crud = useCRUDOperations(EquipmentService);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = useCallback(async () => {
    try {
      await crud.fetchAll({ page: 1, perPage: 100, filters: { status: statusFilter !== 'all' ? statusFilter : undefined } });
    } catch (error) {
      showNotification('Failed to load equipment', 'error');
    }
  }, [statusFilter]);

  const filteredEquipment = crud.data.filter((eq) =>
    eq.name?.toLowerCase().includes(search.toLowerCase()) || eq.category?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedEquipment = filteredEquipment.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredEquipment.length / ITEMS_PER_PAGE);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreate = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingEquipment(null);
      showNotification('Equipment added successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to add equipment', 'error');
      throw error;
    }
  };

  const handleEdit = async (equipment) => {
    try {
      await crud.fetchById(equipment.id);
      setEditingEquipment(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load equipment', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await crud.update(editingEquipment.id, formData);
      setIsFormOpen(false);
      setEditingEquipment(null);
      showNotification('Equipment updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update equipment', 'error');
      throw error;
    }
  };

  const handleDelete = async (equipmentId) => {
    try {
      await crud.delete(equipmentId);
      setDeleteConfirm(null);
      showNotification('Equipment deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete equipment', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingEquipment) {
      await handleUpdate(formData);
    } else {
      await handleCreate(formData);
    }
  };

  return (
    <div className="user-management-page">
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="user-management-header">
        <div className="header-title">
          <FaTools className="header-icon" />
          <h1>Equipment Management</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => { setEditingEquipment(null); setIsFormOpen(true); }} disabled={crud.loading}>
            <FaPlus /> Add Equipment
          </button>
        </div>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search by name or category..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
        </div>
        <div className="role-filters">
          {['all', 'active', 'maintenance', 'retired'].map((status) => (
            <button key={status} className={`filter-btn ${statusFilter === status ? 'active' : ''}`} onClick={() => { setStatusFilter(status); setPage(1); }}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading equipment...</p>
        </div>
      )}

      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadEquipment}>Retry</button>
        </div>
      )}

      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaTools className="empty-icon" />
          <h3>No equipment found</h3>
          <button className="btn btn-primary" onClick={() => { setEditingEquipment(null); setIsFormOpen(true); }}>
            <FaPlus /> Add Equipment
          </button>
        </div>
      )}

      {!crud.loading && paginatedEquipment.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Serial Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEquipment.map((eq) => (
                <tr key={eq.id}>
                  <td className="cell-name"><strong>{eq.name}</strong></td>
                  <td className="cell-email">{eq.category}</td>
                  <td className="cell-email">{eq.serialNumber}</td>
                  <td className="cell-status"><span className={`badge badge-${eq.status}`}>{eq.status}</span></td>
                  <td className="cell-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(eq)} disabled={crud.loading}><FaEdit /></button>
                    <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(eq)} disabled={crud.loading}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button className="pagination-btn" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Previous</button>
              <span className="pagination-info">Page {page} of {totalPages}</span>
              <button className="pagination-btn" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </div>
      )}

      <EquipmentForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingEquipment(null); }} onSubmit={handleFormSubmit} isLoading={crud.loading} error={crud.error} editingEquipment={editingEquipment} />

      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Equipment</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>?</p>
            <div className="confirmation-actions">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)} disabled={crud.loading}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm.id)} disabled={crud.loading}>
                {crud.loading ? '⏳ Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagementPage;
