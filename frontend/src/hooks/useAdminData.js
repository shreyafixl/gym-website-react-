import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for admin data fetching with loading states and error handling
 * Provides consistent data fetching patterns across all admin modules
 */
export const useAdminData = (fetchFunction, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const {
    immediate = true, // Fetch immediately on mount
    refetchOnWindowFocus = false,
    cacheTime = 5 * 60 * 1000, // 5 minutes
    onSuccess,
    onError,
  } = options;

  const fetchData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📊 [Admin Data] Fetching data...`, { args });
      const result = await fetchFunction(...args);

      if (result.success === false) {
        throw new Error(result.message || result.error || 'Data fetch failed');
      }

      setData(result.data || result);
      setLastFetched(new Date());
      
      if (onSuccess) {
        onSuccess(result.data || result);
      }

      console.log(`✅ [Admin Data] Data fetched successfully`, { 
        dataType: result.data ? Object.keys(result.data) : 'raw data',
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      
      if (onError) {
        onError(err);
      }

      console.error(`❌ [Admin Data] Fetch error:`, { 
        error: errorMessage,
        timestamp: new Date().toISOString()
      });

      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    if (immediate) {
      fetchData();
    }
  }, dependencies);

  // Refetch on window focus (optional)
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (lastFetched && Date.now() - lastFetched.getTime() > cacheTime) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, lastFetched, cacheTime, fetchData]);

  // Refetch function
  const refetch = useCallback((...args) => {
    return fetchData(...args);
  }, [fetchData]);

  // Reset function
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setLastFetched(null);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
    lastFetched,
  };
};

/**
 * Hook for paginated data
 */
export const useAdminPaginatedData = (fetchFunction, initialParams = {}) => {
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const [data, setData] = useState({
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const fetchParams = { ...params, ...newParams };
      console.log(`📊 [Admin Paginated] Fetching page:`, fetchParams);

      const result = await fetchFunction(fetchParams);

      if (result.success === false) {
        throw new Error(result.message || result.error || 'Data fetch failed');
      }

      setData({
        items: result.data?.items || result.data || [],
        pagination: result.data?.pagination || {
          currentPage: fetchParams.page,
          totalPages: Math.ceil((result.data?.total || result.total || 0) / fetchParams.limit),
          totalItems: result.data?.total || result.total || 0,
          itemsPerPage: fetchParams.limit,
        },
      });

      setParams(fetchParams);

      console.log(`✅ [Admin Paginated] Page fetched successfully:`, {
        itemCount: result.data?.items?.length || result.data?.length || 0,
        currentPage: fetchParams.page,
        totalPages: Math.ceil((result.data?.total || result.total || 0) / fetchParams.limit),
      });

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      console.error(`❌ [Admin Paginated] Fetch error:`, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, params]);

  // Initial fetch
  useEffect(() => {
    fetchPage();
  }, []);

  const updateParams = useCallback((newParams) => {
    fetchPage(newParams);
  }, [fetchPage]);

  const nextPage = useCallback(() => {
    if (data.pagination.currentPage < data.pagination.totalPages) {
      updateParams({ page: params.page + 1 });
    }
  }, [data.pagination.currentPage, data.pagination.totalPages, params.page, updateParams]);

  const prevPage = useCallback(() => {
    if (data.pagination.currentPage > 1) {
      updateParams({ page: params.page - 1 });
    }
  }, [data.pagination.currentPage, params.page, updateParams]);

  const goToPage = useCallback((page) => {
    if (page >= 1 && page <= data.pagination.totalPages) {
      updateParams({ page });
    }
  }, [data.pagination.totalPages, updateParams]);

  const refresh = useCallback(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    items: data.items,
    pagination: data.pagination,
    loading,
    error,
    params,
    updateParams,
    nextPage,
    prevPage,
    goToPage,
    refresh,
  };
};

/**
 * Hook for real-time data (like live check-ins)
 */
export const useAdminRealTimeData = (fetchFunction, interval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const result = await fetchFunction();

      if (result.success === false) {
        throw new Error(result.message || result.error || 'Real-time data fetch failed');
      }

      setData(result.data || result);
      setIsConnected(true);

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Unknown error occurred';
      setError(errorMessage);
      setIsConnected(false);
      console.error(`❌ [Admin Real-time] Fetch error:`, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Set up interval for real-time updates
  useEffect(() => {
    if (!interval) return;

    const intervalId = setInterval(fetchData, interval);
    return () => clearInterval(intervalId);
  }, [interval, fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    isConnected,
    refresh,
  };
};

/**
 * Hook for CRUD operations with optimistic updates
 */
export const useAdminCRUD = (serviceMethods) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastOperation, setLastOperation] = useState(null);

  const executeOperation = useCallback(async (operation, ...args) => {
    try {
      setLoading(true);
      setError(null);
      setLastOperation(operation);

      console.log(`🔄 [Admin CRUD] Executing ${operation}:`, args);

      const method = serviceMethods[operation];
      if (!method) {
        throw new Error(`Method '${operation}' not found in service methods`);
      }

      const result = await method(...args);

      if (result.success === false) {
        throw new Error(result.message || result.error || `${operation} failed`);
      }

      console.log(`✅ [Admin CRUD] ${operation} completed successfully`);
      return result;

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `${operation} failed`;
      setError(errorMessage);
      console.error(`❌ [Admin CRUD] ${operation} error:`, errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [serviceMethods]);

  const create = useCallback((...args) => executeOperation('create', ...args), [executeOperation]);
  const update = useCallback((...args) => executeOperation('update', ...args), [executeOperation]);
  const deleteItem = useCallback((...args) => executeOperation('delete', ...args), [executeOperation]);
  const fetch = useCallback((...args) => executeOperation('fetch', ...args), [executeOperation]);

  return {
    loading,
    error,
    lastOperation,
    create,
    update,
    delete: deleteItem,
    fetch,
    executeOperation,
  };
};

export default useAdminData;
