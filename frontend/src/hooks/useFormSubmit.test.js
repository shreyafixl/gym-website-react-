import { renderHook, act } from '@testing-library/react';
import useFormSubmit from './useFormSubmit';

describe('useFormSubmit', () => {
  it('should initialize with default state', () => {
    const mockSubmit = jest.fn();
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('should handle successful submission', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ id: 1, name: 'Test' });
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    let submitResult;
    await act(async () => {
      submitResult = await result.current.submit({ name: 'Test' });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(true);
    expect(submitResult).toEqual({ id: 1, name: 'Test' });
  });

  it('should handle submission error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Validation failed',
        },
      },
    };
    const mockSubmit = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    await act(async () => {
      try {
        await result.current.submit({ name: '' });
      } catch (err) {
        // Expected error
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Validation failed');
    expect(result.current.success).toBe(false);
  });

  it('should set loading state during submission', async () => {
    const mockSubmit = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve({ id: 1 }), 100);
        })
    );
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    act(() => {
      result.current.submit({ name: 'Test' });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 150));
    });

    expect(result.current.loading).toBe(false);
  });

  it('should reset state', async () => {
    const mockSubmit = jest.fn().mockResolvedValue({ id: 1 });
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    await act(async () => {
      await result.current.submit({ name: 'Test' });
    });

    expect(result.current.success).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });

  it('should handle error with message property', async () => {
    const mockError = new Error('Network error');
    const mockSubmit = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    await act(async () => {
      try {
        await result.current.submit({ name: 'Test' });
      } catch (err) {
        // Expected error
      }
    });

    expect(result.current.error).toBe('Network error');
  });

  it('should handle error with error property', async () => {
    const mockError = {
      response: {
        data: {
          error: 'Custom error message',
        },
      },
    };
    const mockSubmit = jest.fn().mockRejectedValue(mockError);
    const { result } = renderHook(() => useFormSubmit(mockSubmit));

    await act(async () => {
      try {
        await result.current.submit({ name: 'Test' });
      } catch (err) {
        // Expected error
      }
    });

    expect(result.current.error).toBe('Custom error message');
  });
});
