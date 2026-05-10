import React, { useEffect, useState, useCallback } from 'react';
import { FaBell, FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import useFormValidation from '../hooks/useFormValidation';
import NotificationsService from '../services/superadmin/NotificationsService';
import { required, minLength, combine } from '../utils/validationRules';
import '../styles/user-management.css';
import '../styles/form-modal.css';

const NotificationsManagementForm = ({ isOpen, onClose, onSubmit, isLoading, error, editingNotif = null }) => {
  const form = useFormValidation(
    {
      title: editingNotif?.title || '',
      message: editingNotif?.message || '',
      type: editingNotif?.type || 'info',
      recipientType: editingNotif?.recipientType || 'all',
    },
    {
      title: required('Title is required'),
      message: combine(required('Message is required'), minLength(10, 'Message must be at least 10 characters')),
    }
  );

  useEffect(() => {
    if (editingNotif) {
      form.resetFormWithValues({
        title: editingNotif.title || '',
        message: editingNotif.message || '',
        type: editingNotif.type || 'info',
        recipientType: editingNotif.recipientType || 'all',
      });
    } else {
      form.resetForm();
    }
  }, [editingNotif, isOpen]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.resetForm();
  });

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <h2>{editingNotif ? 'Edit Notification' : 'Create Notification'}</h2>
          <button className="form-modal-close" onClick={onClose} disabled={form.isSubmitting}>✕</button>
        </div>
        {error && <div className="form-error-banner"><p>{error}</p></div>}
        <form onSubmit={handleSubmit} className="form-modal-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input id="title" type="text" placeholder="Enter title" {...form.getFieldProps('title')} className={form.getFieldError('title') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('title') && <span className="form-error">{form.getFieldError('title')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="message">Message *</label>
            <textarea id="message" placeholder="Enter message" {...form.getFieldProps('message')} className={form.getFieldError('message') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} rows="4" />
            {form.getFieldError('message') && <span className="form-error">{form.getFieldError('message')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select id="type" {...form.getFieldProps('type')} className="form-input" disabled={form.isSubmitting}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="recipientType">Send To</label>
            <select id="recipientType" {...form.getFieldProps('recipientType')} className="form-input" disabled={form.isSubmitting}>
              <option value="all">All Users</option>
              <option value="members">Members</option>
              <option value="trainers">Trainers</option>
              <option value="admins">Admins</option>
            </select>
          </div>
          <div className="form-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={form.isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
              {form.isSubmitting ? '⏳ Saving...' : (editingNotif ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const NotificationsManagementPage = () => {
  const crud = useCRUDOperations(NotificationsService);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      await crud.fetchAll({ page: 1, perPage: 100 });
    } catch (error) {
      showNotification('Failed to load notifications', 'error');
    }
  }, []);

  const filteredNotifications = crud.data.filter((notif) =>
    notif.title?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedNotifications = filteredNotifications.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredNotifications.length / ITEMS_PER_PAGE);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreate = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingNotif(null);
      showNotification('Notification created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create notification', 'error');
      throw error;
    }
  };

  const handleEdit = async (notif) => {
    try {
      await crud.fetchById(notif.id);
      setEditingNotif(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load notification', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await crud.update(editingNotif.id, formData);
      setIsFormOpen(false);
      setEditingNotif(null);
      showNotification('Notification updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update notification', 'error');
      throw error;
    }
  };

  const handleDelete = async (notifId) => {
    try {
      await crud.delete(notifId);
      setDeleteConfirm(null);
      showNotification('Notification deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete notification', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingNotif) {
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
          <FaBell className="header-icon" />
          <h1>Notifications</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => { setEditingNotif(null); setIsFormOpen(true); }} disabled={crud.loading}>
            <FaPlus /> Add Notification
          </button>
        </div>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search by title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
        </div>
      </div>

      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading notifications...</p>
        </div>
      )}

      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadNotifications}>Retry</button>
        </div>
      )}

      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaBell className="empty-icon" />
          <h3>No notifications found</h3>
          <button className="btn btn-primary" onClick={() => { setEditingNotif(null); setIsFormOpen(true); }}>
            <FaPlus /> Create Notification
          </button>
        </div>
      )}

      {!crud.loading && paginatedNotifications.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Message</th>
                <th>Type</th>
                <th>Recipients</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedNotifications.map((notif) => (
                <tr key={notif.id}>
                  <td className="cell-name"><strong>{notif.title}</strong></td>
                  <td className="cell-email">{notif.message?.substring(0, 50)}...</td>
                  <td className="cell-email"><span className={`badge badge-${notif.type}`}>{notif.type}</span></td>
                  <td className="cell-email">{notif.recipientType}</td>
                  <td className="cell-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(notif)} disabled={crud.loading}><FaEdit /></button>
                    <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(notif)} disabled={crud.loading}><FaTrash /></button>
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

      <NotificationsManagementForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingNotif(null); }} onSubmit={handleFormSubmit} isLoading={crud.loading} error={crud.error} editingNotif={editingNotif} />

      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Notification</h3>
            <p>Are you sure you want to delete <strong>{deleteConfirm.title}</strong>?</p>
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

export default NotificationsManagementPage;
