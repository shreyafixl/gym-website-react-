import React, { useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import useFormValidation from '../hooks/useFormValidation';
import { required, email, minLength, combine } from '../utils/validationRules';
import '../styles/form-modal.css';

/**
 * User Management Form Component
 * Handles both create and edit operations with validation
 */
const UserManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  editingUser = null,
  branches = [],
}) => {
  // Validation rules for user form
  const validationRules = {
    name: required('Name is required'),
    email: combine(
      required('Email is required'),
      email('Please enter a valid email address')
    ),
    role: required('Role is required'),
    branch: required('Branch is required'),
    phone: (value) => {
      if (!value) return null;
      if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      return null;
    },
  };

  // Initialize form with validation
  const form = useFormValidation(
    {
      name: editingUser?.name || '',
      email: editingUser?.email || '',
      role: editingUser?.role || 'member',
      branch: editingUser?.branch || '',
      phone: editingUser?.phone || '',
      status: editingUser?.status || 'active',
    },
    validationRules
  );

  // Update form when editing user changes
  useEffect(() => {
    if (editingUser) {
      form.resetFormWithValues({
        name: editingUser.name || '',
        email: editingUser.email || '',
        role: editingUser.role || 'member',
        branch: editingUser.branch || '',
        phone: editingUser.phone || '',
        status: editingUser.status || 'active',
      });
    } else {
      form.resetForm();
    }
  }, [editingUser, isOpen]);

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
          <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
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
            <label htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter full name"
              {...form.getFieldProps('name')}
              className={form.getFieldError('name') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('name') && (
              <span className="form-error">{form.getFieldError('name')}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
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

          {/* Role Field */}
          <div className="form-group">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              {...form.getFieldProps('role')}
              className={form.getFieldError('role') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            >
              <option value="">Select a role</option>
              <option value="member">Member</option>
              <option value="trainer">Trainer</option>
              <option value="admin">Admin</option>
              <option value="superadmin">SuperAdmin</option>
            </select>
            {form.getFieldError('role') && (
              <span className="form-error">{form.getFieldError('role')}</span>
            )}
          </div>

          {/* Branch Field */}
          <div className="form-group">
            <label htmlFor="branch">Branch *</label>
            <select
              id="branch"
              {...form.getFieldProps('branch')}
              className={form.getFieldError('branch') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            >
              <option value="">Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {form.getFieldError('branch') && (
              <span className="form-error">{form.getFieldError('branch')}</span>
            )}
          </div>

          {/* Status Field (only for edit) */}
          {editingUser && (
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
                <option value="suspended">Suspended</option>
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
                editingUser ? 'Update User' : 'Create User'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagementForm;
