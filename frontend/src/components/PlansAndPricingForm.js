import React, { useState, useEffect } from 'react';
import { FaTimes, FaSpinner, FaPlus, FaTrash } from 'react-icons/fa';
import useFormValidation from '../hooks/useFormValidation';
import { required, number, combine } from '../utils/validationRules';
import '../styles/form-modal.css';

/**
 * Plans & Pricing Form Component
 * Form for creating and editing membership plans
 */
const PlansAndPricingForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  editingPlan,
}) => {
  const [submitError, setSubmitError] = useState(null);
  const [features, setFeatures] = useState([]);
  const [newFeature, setNewFeature] = useState('');

  // Validation rules
  const validationRules = {
    name: required('Plan name is required'),
    price: combine(
      required('Price is required'),
      number('Price must be a valid number')
    ),
    duration: required('Duration is required'),
    status: required('Status is required'),
  };

  // Form validation hook
  const form = useFormValidation(
    editingPlan || {
      name: '',
      price: '',
      duration: '',
      status: 'active',
      description: '',
    },
    validationRules
  );

  // Update form when editing plan changes
  useEffect(() => {
    if (editingPlan) {
      form.resetFormWithValues(editingPlan);
      setFeatures(editingPlan.features || []);
    } else {
      form.resetForm();
      setFeatures([]);
    }
    setNewFeature('');
  }, [editingPlan, isOpen]);

  // Handle add feature
  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  // Handle remove feature
  const handleRemoveFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      setSubmitError(null);
      await onSubmit({
        ...values,
        features,
        price: Number(values.price),
      });
    } catch (err) {
      setSubmitError(err.message || 'Failed to save plan');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="form-modal-overlay" onClick={onClose}>
      <div className="form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="form-modal-header">
          <h2>{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
          <button className="form-modal-close" onClick={onClose} disabled={isLoading}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-modal-body">
          {/* Error Messages */}
          {submitError && (
            <div className="form-error-message">
              <strong>Error:</strong> {submitError}
            </div>
          )}
          {error && (
            <div className="form-error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Form Fields */}
          <div className="form-group">
            <label htmlFor="name">Plan Name *</label>
            <input
              id="name"
              type="text"
              placeholder="e.g., Premium Plan"
              {...form.getFieldProps('name')}
              className={form.getFieldError('name') ? 'input-error' : ''}
              disabled={isLoading}
            />
            {form.getFieldError('name') && (
              <span className="field-error">{form.getFieldError('name')}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                id="price"
                type="number"
                placeholder="e.g., 49.99"
                step="0.01"
                {...form.getFieldProps('price')}
                className={form.getFieldError('price') ? 'input-error' : ''}
                disabled={isLoading}
              />
              {form.getFieldError('price') && (
                <span className="field-error">{form.getFieldError('price')}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="duration">Duration *</label>
              <input
                id="duration"
                type="text"
                placeholder="e.g., 1 month"
                {...form.getFieldProps('duration')}
                className={form.getFieldError('duration') ? 'input-error' : ''}
                disabled={isLoading}
              />
              {form.getFieldError('duration') && (
                <span className="field-error">{form.getFieldError('duration')}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              {...form.getFieldProps('status')}
              className={form.getFieldError('status') ? 'input-error' : ''}
              disabled={isLoading}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
            {form.getFieldError('status') && (
              <span className="field-error">{form.getFieldError('status')}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Enter plan description (optional)"
              rows="3"
              {...form.getFieldProps('description')}
              disabled={isLoading}
            />
          </div>

          {/* Features Section */}
          <div className="form-group">
            <label>Features</label>
            <div className="features-input">
              <input
                type="text"
                placeholder="Add a feature..."
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleAddFeature}
                disabled={isLoading || !newFeature.trim()}
              >
                <FaPlus /> Add
              </button>
            </div>

            {/* Features List */}
            {features.length > 0 && (
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <span>✓ {feature}</span>
                    <button
                      type="button"
                      className="feature-remove-btn"
                      onClick={() => handleRemoveFeature(index)}
                      disabled={isLoading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || form.isSubmitting}
            >
              {isLoading || form.isSubmitting ? (
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

export default PlansAndPricingForm;
