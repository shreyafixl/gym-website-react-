import { useState, useCallback } from 'react';

/**
 * Custom hook for filtering
 * Manages filter state and filtering logic
 */
export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasFilters = useCallback(() => {
    return Object.keys(filters).length > 0;
  }, [filters]);

  return {
    filters,
    updateFilter,
    updateFilters,
    removeFilter,
    clearFilters,
    hasFilters,
  };
};

export default useFilters;
