import React, { useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import useFormValidation from '../hooks/useFormValidation';
import { required, email, minLength, combine } from '../utils/validationRules';
import '../styles/form-modal.css';

/**
 * Branch Management Form Component
 * Handles both create and edit operations with validation
 */
const BranchManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  editingBranch = null,
}) => {
  // Validation rules for branch form
  const validationRules = {
    name: required('Branch name is required'),
    code: combine(
      required('Branch code is required'),
      minLength(2, 'Code must be at least 2 characters')
    ),
    city: required('City is required'),
    address: required('Address is required'),
    phone: (value) => {
      if (!value) return null;
      if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
    email: (value) => {
      if (!value) return null;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    },
  };

  // Initialize form with validation
  const form = useFormValidation(
    {
      name: editingBranch?.name || '',
      code: editingBranch?.code || '',
      city: editingBranch?.city || '',
      address: editingBranch?.address || '',
      phone: editingBranch?.phone || '',
      email: editingBranch?.email || '',
      status: editingBranch?.status || 'active',
    },
    validationRules
  );

  // Update form when editing branch changes
  useEffect(() => {
    if (editingBranch) {
      form.resetFormWithValues({
        name: editingBranch.name || '',
        code: editingBranch.code || '',
        city: editingBranch.city || '',
        address: editingBranch.address || '',
        phone: editingBranch.phone || '',
        email: editingBranch.email || '',
        status: editingBranch.status || 'active',
      });
    } else {
      form.resetForm();
    }
  }, [editingBranch, isOpen]);

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    form.resetForm();
  });

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="form-modal-header">
          <h2>{editingBranch ? 'Edit Branch' : 'Create New Branch'}</h2>
          <button
            className="form-modal-close"
            onClick={onClose}
            disabled={form.isSubmitting}
          >
            <FaTimes />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="form-error-banner">
            <p>{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="form-modal-form">
          {/* Name Field */}
          <div className="form-group">
            <label htmlFor="name">Branch Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter branch name"
              {...form.getFieldProps('name')}
              className={form.getFieldError('name') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('name') && (
              <span className="form-error">{form.getFieldError('name')}</span>
            )}
          </div>

          {/* Code Field */}
          <div className="form-group">
            <label htmlFor="code">Branch Code *</label>
            <input
              id="code"
              type="text"
              placeholder="Enter branch code"
              {...form.getFieldProps('code')}
              className={form.getFieldError('code') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting || !!editingBranch}
            />
            {form.getFieldError('code') && (
              <span className="form-error">{form.getFieldError('code')}</span>
            )}
          </div>

          {/* City Field */}
          <div className="form-group">
            <label htmlFor="city">City *</label>
            <input
              id="city"
              type="text"
              placeholder="Enter city"
              {...form.getFieldProps('city')}
              className={form.getFieldError('city') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('city') && (
              <span className="form-error">{form.getFieldError('city')}</span>
            )}
          </div>

          {/* Address Field */}
          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              placeholder="Enter address"
              {...form.getFieldProps('address')}
              className={form.getFieldError('address') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
              rows="3"
            />
            {form.getFieldError('address') && (
              <span className="form-error">{form.getFieldError('address')}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              {...form.getFieldProps('phone')}
              className={form.getFieldError('phone') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('phone') && (
              <span className="form-error">{form.getFieldError('phone')}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter email address"
              {...form.getFieldProps('email')}
              className={form.getFieldError('email') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('email') && (
              <span className="form-error">{form.getFieldError('email')}</span>
            )}
          </div>

          {/* Status Field (only for edit) */}
          {editingBranch && (
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                {...form.getFieldProps('status')}
                className="form-input"
                disabled={form.isSubmitting}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="planned">Planned</option>
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={form.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={form.isSubmitting}
            >
              {form.isSubmitting ? (
                <>
                  <FaSpinner className="spinner" /> Saving...
                </>
              ) : (
                editingBranch ? 'Update Branch' : 'Create Branch'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchManagementForm;
