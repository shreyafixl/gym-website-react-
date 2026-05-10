import { useState, useCallback } from 'react';

/**
 * Custom hook for pagination
 * Manages page state and pagination logic
 */
export const usePagination = (initialPage = 1, initialPerPage = 20) => {
  const [page, setPage] = useState(initialPage);
  const [perPage, setPerPage] = useState(initialPerPage);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / perPage);

  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const changePerPage = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setPage(1); // Reset to first page when changing per_page
  }, []);

  const updateTotal = useCallback((newTotal) => {
    setTotal(newTotal);
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setPerPage(initialPerPage);
    setTotal(0);
  }, [initialPage, initialPerPage]);

  return {
    page,
    perPage,
    total,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changePerPage,
    updateTotal,
    reset,
  };
};

export default usePagination;
