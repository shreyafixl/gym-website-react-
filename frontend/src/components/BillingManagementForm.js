import React, { useEffect } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import useFormValidation from '../hooks/useFormValidation';
import { required, number, minLength, combine } from '../utils/validationRules';
import '../styles/form-modal.css';

/**
 * Billing Management Form Component
 * Handles both create and edit operations with validation
 */
const BillingManagementForm = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  error,
  editingBilling = null,
}) => {
  // Validation rules for billing form
  const validationRules = {
    invoiceNumber: combine(
      required('Invoice number is required'),
      minLength(3, 'Invoice number must be at least 3 characters')
    ),
    amount: combine(
      required('Amount is required'),
      number('Amount must be a valid number')
    ),
    description: required('Description is required'),
    dueDate: required('Due date is required'),
    status: required('Status is required'),
  };

  // Initialize form with validation
  const form = useFormValidation(
    {
      invoiceNumber: editingBilling?.invoiceNumber || '',
      amount: editingBilling?.amount || '',
      description: editingBilling?.description || '',
      dueDate: editingBilling?.dueDate || '',
      status: editingBilling?.status || 'pending',
    },
    validationRules
  );

  // Update form when editing billing changes
  useEffect(() => {
    if (editingBilling) {
      form.resetFormWithValues({
        invoiceNumber: editingBilling.invoiceNumber || '',
        amount: editingBilling.amount || '',
        description: editingBilling.description || '',
        dueDate: editingBilling.dueDate || '',
        status: editingBilling.status || 'pending',
      });
    } else {
      form.resetForm();
    }
  }, [editingBilling, isOpen]);

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
          <h2>{editingBilling ? 'Edit Billing' : 'Create New Billing Entry'}</h2>
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
          {/* Invoice Number Field */}
          <div className="form-group">
            <label htmlFor="invoiceNumber">Invoice Number *</label>
            <input
              id="invoiceNumber"
              type="text"
              placeholder="Enter invoice number"
              {...form.getFieldProps('invoiceNumber')}
              className={form.getFieldError('invoiceNumber') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting || !!editingBilling}
            />
            {form.getFieldError('invoiceNumber') && (
              <span className="form-error">{form.getFieldError('invoiceNumber')}</span>
            )}
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              id="amount"
              type="number"
              placeholder="Enter amount"
              step="0.01"
              {...form.getFieldProps('amount')}
              className={form.getFieldError('amount') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('amount') && (
              <span className="form-error">{form.getFieldError('amount')}</span>
            )}
          </div>

          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              placeholder="Enter billing description"
              {...form.getFieldProps('description')}
              className={form.getFieldError('description') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
              rows="3"
            />
            {form.getFieldError('description') && (
              <span className="form-error">{form.getFieldError('description')}</span>
            )}
          </div>

          {/* Due Date Field */}
          <div className="form-group">
            <label htmlFor="dueDate">Due Date *</label>
            <input
              id="dueDate"
              type="date"
              {...form.getFieldProps('dueDate')}
              className={form.getFieldError('dueDate') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            />
            {form.getFieldError('dueDate') && (
              <span className="form-error">{form.getFieldError('dueDate')}</span>
            )}
          </div>

          {/* Status Field */}
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              {...form.getFieldProps('status')}
              className={form.getFieldError('status') ? 'form-input error' : 'form-input'}
              disabled={form.isSubmitting}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {form.getFieldError('status') && (
              <span className="form-error">{form.getFieldError('status')}</span>
            )}
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
                editingBilling ? 'Update Billing' : 'Create Billing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingManagementForm;
