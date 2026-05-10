import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for fetching SuperAdmin data
 * Generic data fetching hook with loading, error, and retry logic
 */
export const useSuperAdminFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn();
      setData(result.data || result);
      setRetryCount(0);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch data';
      setError(errorMessage);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const retry = useCallback(async () => {
    setRetryCount((prev) => prev + 1);
    await fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    retryCount,
    retry,
    refetch,
  };
};

export default useSuperAdminFetch;
