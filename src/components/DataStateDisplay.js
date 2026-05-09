import React from 'react';
import { FaSpinner, FaExclamationCircle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import '../styles/dataStateDisplay.css';

/**
 * Loading State Component
 */
export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="data-state-container loading-state">
    <FaSpinner className="spinner-icon" />
    <p>{message}</p>
  </div>
);

/**
 * Error State Component
 */
export const ErrorState = ({ error, onRetry, message = 'An error occurred' }) => (
  <div className="data-state-container error-state">
    <FaExclamationCircle className="error-icon" />
    <p className="error-message">{message}</p>
    {error && <p className="error-details">{error}</p>}
    {onRetry && (
      <button className="retry-button" onClick={onRetry}>
        Try Again
      </button>
    )}
  </div>
);

/**
 * Success State Component
 */
export const SuccessState = ({ message = 'Operation successful!' }) => (
  <div className="data-state-container success-state">
    <FaCheckCircle className="success-icon" />
    <p>{message}</p>
  </div>
);

/**
 * Empty State Component
 */
export const EmptyState = ({ message = 'No data available', icon = <FaInfoCircle /> }) => (
  <div className="data-state-container empty-state">
    {icon}
    <p>{message}</p>
  </div>
);

/**
 * Toast Notification Component
 */
export const Toast = ({ type = 'info', message, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const toastClass = `toast toast-${type}`;

  return (
    <div className={toastClass}>
      <div className="toast-content">
        {type === 'success' && <FaCheckCircle className="toast-icon" />}
        {type === 'error' && <FaExclamationCircle className="toast-icon" />}
        {type === 'info' && <FaInfoCircle className="toast-icon" />}
        <span>{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

/**
 * Conditional Data Display Component
 * Handles loading, error, empty, and success states automatically
 */
export const DataDisplay = ({
  data,
  loading,
  error,
  isEmpty = false,
  children,
  onRetry,
  loadingMessage = 'Loading...',
  errorMessage = 'Failed to load data',
  emptyMessage = 'No data available',
}) => {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRetry} message={errorMessage} />;
  }

  if (isEmpty || !data) {
    return <EmptyState message={emptyMessage} />;
  }

  return children;
};

export default {
  LoadingState,
  ErrorState,
  SuccessState,
  EmptyState,
  Toast,
  DataDisplay,
};
