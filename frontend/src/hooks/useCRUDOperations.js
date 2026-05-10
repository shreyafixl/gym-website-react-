import { useState, useCallback } from 'react';

/**
 * Custom hook for CRUD operations
 * Handles Create, Read, Update, Delete operations with loading and error states
 */
export const useCRUDOperations = (service) => {
  const [data, setData] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Fetch all items
   */
  const fetchAll = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.getAll(params);
      setData(result.data || result);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  /**
   * Fetch single item by ID
   */
  const fetchById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.getById(id);
      setCurrentItem(result.data || result);
      return result;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to fetch item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  /**
   * Create new item
   */
  const create = useCallback(async (itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.create(itemData);
      const newItem = result.data || result;
      
      // Add new item to data array
      setData((prev) => [...prev, newItem]);
      setSuccess('Item created successfully');
      
      return newItem;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service]);

  /**
   * Update existing item
   */
  const update = useCallback(async (id, itemData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await service.update(id, itemData);
      const updatedItem = result.data || result;
      
      // Update item in data array
      setData((prev) =>
        prev.map((item) => (item.id === id ? updatedItem : item))
      );
      
      // Update current item if it's the one being edited
      if (currentItem?.id === id) {
        setCurrentItem(updatedItem);
      }
      
      setSuccess('Item updated successfully');
      return updatedItem;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to update item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, currentItem]);

  /**
   * Delete item
   */
  const delete_ = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await service.delete(id);
      
      // Remove item from data array
      setData((prev) => prev.filter((item) => item.id !== id));
      
      // Clear current item if it's the one being deleted
      if (currentItem?.id === id) {
        setCurrentItem(null);
      }
      
      setSuccess('Item deleted successfully');
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to delete item';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, currentItem]);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clear success message
   */
  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setData([]);
    setCurrentItem(null);
    setLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  return {
    data,
    currentItem,
    loading,
    error,
    success,
    fetchAll,
    fetchById,
    create,
    update,
    delete: delete_,
    clearError,
    clearSuccess,
    clearMessages,
    reset,
    setData,
    setCurrentItem,
  };
};

export default useCRUDOperations;
