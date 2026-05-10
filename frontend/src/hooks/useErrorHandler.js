import { useState, useCallback } from 'react';

/**
 * Custom hook for error handling
 * Manages error state and error handling logic
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  const handleError = useCallback((err) => {
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      'An error occurred';
    setError(errorMessage);
  }, []);

  const handleFieldErrors = useCallback((fieldErrors) => {
    setErrors(fieldErrors);
  }, []);

  const handleValidationError = useCallback((err) => {
    if (err.response?.data?.errors) {
      setErrors(err.response.data.errors);
    } else {
      handleError(err);
    }
  }, [handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setError(null);
    setErrors({});
  }, []);

  const hasErrors = useCallback(() => {
    return error !== null || Object.keys(errors).length > 0;
  }, [error, errors]);

  return {
    error,
    errors,
    handleError,
    handleFieldErrors,
    handleValidationError,
    clearError,
    clearFieldError,
    clearAllErrors,
    hasErrors,
  };
};

export default useErrorHandler;
