import { renderHook, act } from '@testing-library/react';
import useCRUDOperations from './useCRUDOperations';

describe('useCRUDOperations', () => {
  const mockService = {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Fetch Operations', () => {
    it('should fetch all items', async () => {
      const mockData = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      mockService.getAll.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.data).toEqual(mockData);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch all error', async () => {
      const error = new Error('Fetch failed');
      mockService.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.fetchAll();
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Fetch failed');
      expect(result.current.loading).toBe(false);
    });

    it('should fetch item by ID', async () => {
      const mockItem = { id: 1, name: 'Item 1' };
      mockService.getById.mockResolvedValue({ data: mockItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        await result.current.fetchById(1);
      });

      expect(result.current.currentItem).toEqual(mockItem);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle fetch by ID error', async () => {
      const error = new Error('Item not found');
      mockService.getById.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.fetchById(1);
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Item not found');
    });
  });

  describe('Create Operation', () => {
    it('should create new item', async () => {
      const newItem = { id: 3, name: 'New Item' };
      mockService.create.mockResolvedValue({ data: newItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      // Set initial data
      await act(async () => {
        result.current.setData([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ]);
      });

      await act(async () => {
        await result.current.create({ name: 'New Item' });
      });

      expect(result.current.data).toHaveLength(3);
      expect(result.current.data[2]).toEqual(newItem);
      expect(result.current.success).toBe('Item created successfully');
    });

    it('should handle create error', async () => {
      const error = new Error('Creation failed');
      mockService.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.create({ name: 'New Item' });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Creation failed');
    });
  });

  describe('Update Operation', () => {
    it('should update existing item', async () => {
      const updatedItem = { id: 1, name: 'Updated Item' };
      mockService.update.mockResolvedValue({ data: updatedItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      // Set initial data
      await act(async () => {
        result.current.setData([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ]);
      });

      await act(async () => {
        await result.current.update(1, { name: 'Updated Item' });
      });

      expect(result.current.data[0]).toEqual(updatedItem);
      expect(result.current.success).toBe('Item updated successfully');
    });

    it('should update current item if it matches', async () => {
      const updatedItem = { id: 1, name: 'Updated Item' };
      mockService.update.mockResolvedValue({ data: updatedItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      // Set current item
      await act(async () => {
        result.current.setCurrentItem({ id: 1, name: 'Item 1' });
      });

      await act(async () => {
        await result.current.update(1, { name: 'Updated Item' });
      });

      expect(result.current.currentItem).toEqual(updatedItem);
    });

    it('should handle update error', async () => {
      const error = new Error('Update failed');
      mockService.update.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.update(1, { name: 'Updated Item' });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Update failed');
    });
  });

  describe('Delete Operation', () => {
    it('should delete item', async () => {
      mockService.delete.mockResolvedValue({});

      const { result } = renderHook(() => useCRUDOperations(mockService));

      // Set initial data
      await act(async () => {
        result.current.setData([
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ]);
      });

      await act(async () => {
        await result.current.delete(1);
      });

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data[0].id).toBe(2);
      expect(result.current.success).toBe('Item deleted successfully');
    });

    it('should clear current item if it matches deleted item', async () => {
      mockService.delete.mockResolvedValue({});

      const { result } = renderHook(() => useCRUDOperations(mockService));

      // Set current item
      await act(async () => {
        result.current.setCurrentItem({ id: 1, name: 'Item 1' });
      });

      await act(async () => {
        await result.current.delete(1);
      });

      expect(result.current.currentItem).toBeNull();
    });

    it('should handle delete error', async () => {
      const error = new Error('Delete failed');
      mockService.delete.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.delete(1);
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Delete failed');
    });
  });

  describe('Message Management', () => {
    it('should clear error message', async () => {
      const error = new Error('Test error');
      mockService.getAll.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.fetchAll();
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBeDefined();

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should clear success message', async () => {
      const newItem = { id: 1, name: 'Item 1' };
      mockService.create.mockResolvedValue({ data: newItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        await result.current.create({ name: 'Item 1' });
      });

      expect(result.current.success).toBeDefined();

      act(() => {
        result.current.clearSuccess();
      });

      expect(result.current.success).toBeNull();
    });

    it('should clear all messages', async () => {
      const newItem = { id: 1, name: 'Item 1' };
      mockService.create.mockResolvedValue({ data: newItem });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        await result.current.create({ name: 'Item 1' });
      });

      expect(result.current.success).toBeDefined();

      act(() => {
        result.current.clearMessages();
      });

      expect(result.current.success).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });

  describe('Reset Operation', () => {
    it('should reset all state', async () => {
      const mockData = [{ id: 1, name: 'Item 1' }];
      mockService.getAll.mockResolvedValue({ data: mockData });

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.data).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.data).toEqual([]);
      expect(result.current.currentItem).toBeNull();
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.success).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should set loading state during fetch', async () => {
      mockService.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      );

      const { result } = renderHook(() => useCRUDOperations(mockService));

      const fetchPromise = act(async () => {
        await result.current.fetchAll();
      });

      expect(result.current.loading).toBe(true);

      await fetchPromise;

      expect(result.current.loading).toBe(false);
    });
  });

  describe('Error Handling with API Response', () => {
    it('should extract error message from API response', async () => {
      const error = new Error('API Error');
      error.response = {
        data: {
          message: 'User already exists',
        },
      };
      mockService.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.create({ name: 'Item' });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('User already exists');
    });

    it('should use error field if message is not available', async () => {
      const error = new Error('API Error');
      error.response = {
        data: {
          error: 'Validation failed',
        },
      };
      mockService.create.mockRejectedValue(error);

      const { result } = renderHook(() => useCRUDOperations(mockService));

      await act(async () => {
        try {
          await result.current.create({ name: 'Item' });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Validation failed');
    });
  });
});
