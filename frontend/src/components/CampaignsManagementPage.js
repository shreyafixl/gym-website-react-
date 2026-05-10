import React, { useEffect, useState, useCallback } from 'react';
import { FaBullhorn, FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import useCRUDOperations from '../hooks/useCRUDOperations';
import useFormValidation from '../hooks/useFormValidation';
import CampaignsService from '../services/superadmin/CampaignsService';
import { required, minLength, combine } from '../utils/validationRules';
import '../styles/user-management.css';
import '../styles/form-modal.css';

const CampaignsManagementForm = ({ isOpen, onClose, onSubmit, isLoading, error, editingCampaign = null }) => {
  const form = useFormValidation(
    {
      name: editingCampaign?.name || '',
      type: editingCampaign?.type || 'email',
      targetAudience: editingCampaign?.targetAudience || 'all',
      discount: editingCampaign?.discount || '',
    },
    {
      name: required('Campaign name is required'),
      discount: (value) => {
        if (!value) return null;
        if (isNaN(value) || value < 0 || value > 100) return 'Discount must be between 0 and 100';
        return null;
      },
    }
  );

  useEffect(() => {
    if (editingCampaign) {
      form.resetFormWithValues({
        name: editingCampaign.name || '',
        type: editingCampaign.type || 'email',
        targetAudience: editingCampaign.targetAudience || 'all',
        discount: editingCampaign.discount || '',
      });
    } else {
      form.resetForm();
    }
  }, [editingCampaign, isOpen]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.resetForm();
  });

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <h2>{editingCampaign ? 'Edit Campaign' : 'Create Campaign'}</h2>
          <button className="form-modal-close" onClick={onClose} disabled={form.isSubmitting}>✕</button>
        </div>
        {error && <div className="form-error-banner"><p>{error}</p></div>}
        <form onSubmit={handleSubmit} className="form-modal-form">
          <div className="form-group">
            <label htmlFor="name">Campaign Name *</label>
            <input id="name" type="text" placeholder="Enter campaign name" {...form.getFieldProps('name')} className={form.getFieldError('name') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('name') && <span className="form-error">{form.getFieldError('name')}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="type">Campaign Type</label>
            <select id="type" {...form.getFieldProps('type')} className="form-input" disabled={form.isSubmitting}>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push Notification</option>
              <option value="social">Social Media</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="targetAudience">Target Audience</label>
            <select id="targetAudience" {...form.getFieldProps('targetAudience')} className="form-input" disabled={form.isSubmitting}>
              <option value="all">All Users</option>
              <option value="members">Members</option>
              <option value="inactive">Inactive Members</option>
              <option value="premium">Premium Members</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input id="discount" type="number" placeholder="Enter discount percentage" min="0" max="100" {...form.getFieldProps('discount')} className={form.getFieldError('discount') ? 'form-input error' : 'form-input'} disabled={form.isSubmitting} />
            {form.getFieldError('discount') && <span className="form-error">{form.getFieldError('discount')}</span>}
          </div>
          <div className="form-modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={form.isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={form.isSubmitting}>
              {form.isSubmitting ? '⏳ Saving...' : (editingCampaign ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CampaignsManagementPage = () => {
  const crud = useCRUDOperations(CampaignsService);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [notification, setNotification] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      await crud.fetchAll({ page: 1, perPage: 100 });
    } catch (error) {
      showNotification('Failed to load campaigns', 'error');
    }
  }, []);

  const filteredCampaigns = crud.data.filter((campaign) =>
    campaign.name?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedCampaigns = filteredCampaigns.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreate = async (formData) => {
    try {
      await crud.create(formData);
      setIsFormOpen(false);
      setEditingCampaign(null);
      showNotification('Campaign created successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to create campaign', 'error');
      throw error;
    }
  };

  const handleEdit = async (campaign) => {
    try {
      await crud.fetchById(campaign.id);
      setEditingCampaign(crud.currentItem);
      setIsFormOpen(true);
    } catch (error) {
      showNotification('Failed to load campaign', 'error');
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await crud.update(editingCampaign.id, formData);
      setIsFormOpen(false);
      setEditingCampaign(null);
      showNotification('Campaign updated successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to update campaign', 'error');
      throw error;
    }
  };

  const handleDelete = async (campaignId) => {
    try {
      await crud.delete(campaignId);
      setDeleteConfirm(null);
      showNotification('Campaign deleted successfully', 'success');
    } catch (error) {
      showNotification(error.message || 'Failed to delete campaign', 'error');
    }
  };

  const handleFormSubmit = async (formData) => {
    if (editingCampaign) {
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
          <FaBullhorn className="header-icon" />
          <h1>Campaigns</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={() => { setEditingCampaign(null); setIsFormOpen(true); }} disabled={crud.loading}>
            <FaPlus /> Add Campaign
          </button>
        </div>
      </div>

      <div className="user-management-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search by campaign name..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="search-input" />
        </div>
      </div>

      {crud.loading && crud.data.length === 0 && (
        <div className="loading-state">
          <FaSpinner className="spinner" />
          <p>Loading campaigns...</p>
        </div>
      )}

      {crud.error && (
        <div className="error-state">
          <FaExclamationCircle />
          <p>{crud.error}</p>
          <button className="btn btn-primary" onClick={loadCampaigns}>Retry</button>
        </div>
      )}

      {!crud.loading && crud.data.length === 0 && !crud.error && (
        <div className="empty-state">
          <FaBullhorn className="empty-icon" />
          <h3>No campaigns found</h3>
          <button className="btn btn-primary" onClick={() => { setEditingCampaign(null); setIsFormOpen(true); }}>
            <FaPlus /> Create Campaign
          </button>
        </div>
      )}

      {!crud.loading && paginatedCampaigns.length > 0 && (
        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Target Audience</th>
                <th>Discount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCampaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="cell-name"><strong>{campaign.name}</strong></td>
                  <td className="cell-email">{campaign.type}</td>
                  <td className="cell-email">{campaign.targetAudience}</td>
                  <td className="cell-email">{campaign.discount}%</td>
                  <td className="cell-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(campaign)} disabled={crud.loading}><FaEdit /></button>
                    <button className="action-btn delete-btn" onClick={() => setDeleteConfirm(campaign)} disabled={crud.loading}><FaTrash /></button>
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

      <CampaignsManagementForm isOpen={isFormOpen} onClose={() => { setIsFormOpen(false); setEditingCampaign(null); }} onSubmit={handleFormSubmit} isLoading={crud.loading} error={crud.error} editingCampaign={editingCampaign} />

      {deleteConfirm && (
        <div className="confirmation-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Campaign</h3>
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

export default CampaignsManagementPage;
