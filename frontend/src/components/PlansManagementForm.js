import React, { useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import useFormValidation from '../hooks/useFormValidation';
import { required, number, minLength, combine } from '../utils/validationRules';
import '../styles/form-modal.css';

/**
 * Plans Management Form Component
 * Handles both create and edit operations with validation
 */
const PlansManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  editingPlan = null,
}) => {
  // Validation rules for plans form
  const validationRules = {
    name: combine(
      required('Plan name is required'),
      minLength(3, 'Plan name must be at least 3 characters')
    ),
    code: combine(
      required('Plan code is required'),
      minLength(2, 'Code must be at least 2 characters')
    ),
    price: combine(
      required('Price is required'),
      number('Price must be a valid number')
    ),
    duration: combine(
      required('Duration is required'),
      number('Duration must be a valid number')
    ),
  };

  // Initialize form with validation
  const form = useFormValidation(
    {
      name: editingPlan?.name || '',
      code: editingPlan?.code || '',
      price: editingPlan?.price || '',
      duration: editingPlan?.duration || '',
      durationLabel: editingPlan?.durationLabel || 'months',
      features: editingPlan?.features || '',
      isPopular: editingPlan?.isPopular || false,
      isActive: editingPlan?.isActive !== undefined ? editingPlan.isActive : true,
    },
    validationRules
  );

  // Update form when editing plan changes
  useEffect(() => {
    if (editingPlan) {
      form.resetFormWithValues({
        name: editingPlan.name || '',
        code: editingPlan.code || '',
        price: editingPlan.price || '',
        duration: editingPlan.duration || '',
        durationLabel: editingPlan.durationLabel || 'months',
        features: editingPlan.features || '',
        isPopular: editingPlan.isPopular || false,
        isActive: editingPlan.isActive !== undefined ? editingPlan.isActive : true,
      });
    } else {
      form.resetForm();
    }
  }, [editingPlan, isOpen]);

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
          <h2>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
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
            <label htmlFor="name">Plan Name *</label>
            <input
              id="name"
              type="text"
              placeholder="Enter plan name"
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
            <label htmlFor="code">Plan Code *</label>
            <input
              id="code"
              type="text"
              placeholder="Enter plan code"
              {...form.getFieldProps('code')}
              className={form.getFieldError('code') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting || !!editingPlan}
            />
            {form.getFieldError('code') && (
              <span className="form-error">{form.getFieldError('code')}</span>
            )}
          </div>

          {/* Price Field */}
          <div className="form-group">
            <label htmlFor="price">Price (₹) *</label>
            <input
              id="price"
              type="number"
              placeholder="Enter price"
              step="0.01"
              {...form.getFieldProps('price')}
              className={form.getFieldError('price') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('price') && (
              <span className="form-error">{form.getFieldError('price')}</span>
            )}
          </div>

          {/* Duration Field */}
          <div className="form-group">
            <label htmlFor="duration">Duration *</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                id="duration"
                type="number"
                placeholder="Enter duration"
                {...form.getFieldProps('duration')}
                className={form.getFieldError('duration') ? 'form-input error' : 'form-input'}
                disabled={form.isSubmitting}
                style={{ flex: 1 }}
              />
              <select
                {...form.getFieldProps('durationLabel')}
                className="form-input"
                disabled={form.isSubmitting}
                style={{ flex: 1 }}
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
            {form.getFieldError('duration') && (
              <span className="form-error">{form.getFieldError('duration')}</span>
            )}
          </div>

          {/* Features Field */}
          <div className="form-group">
            <label htmlFor="features">Features (comma-separated)</label>
            <textarea
              id="features"
              placeholder="Enter features separated by commas"
              {...form.getFieldProps('features')}
              className="form-input"
              disabled={form.isSubmitting}
              rows="3"
            />
          </div>

          {/* Popular Checkbox */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                {...form.getFieldProps('isPopular')}
                disabled={form.isSubmitting}
              />
              Mark as Popular
            </label>
          </div>

          {/* Active Checkbox */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                {...form.getFieldProps('isActive')}
                disabled={form.isSubmitting}
              />
              Active
            </label>
          </div>

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
                editingPlan ? 'Update Plan' : 'Create Plan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlansManagementForm;
