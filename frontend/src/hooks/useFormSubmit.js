import { useState, useCallback } from 'react';

/**
 * Custom hook for form submission
 * Handles loading, error, and success states
 */
export const useFormSubmit = (submitFn) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = useCallback(
    async (formData) => {
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const result = await submitFn(formData);

        setSuccess(true);
        return result;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'An error occurred';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [submitFn]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { submit, loading, error, success, reset };
};

export default useFormSubmit;
