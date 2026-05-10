import { renderHook, act } from '@testing-library/react';
import useErrorHandler from './useErrorHandler';

describe('useErrorHandler', () => {
  it('should initialize with no errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors()).toBe(false);
  });

  it('should handle error', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = {
      response: {
        data: {
          message: 'Something went wrong',
        },
      },
    };

    act(() => {
      result.current.handleError(error);
    });

    expect(result.current.error).toBe('Something went wrong');
    expect(result.current.hasErrors()).toBe(true);
  });

  it('should handle field errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    const fieldErrors = {
      email: 'Invalid email',
      password: 'Password too short',
    };

    act(() => {
      result.current.handleFieldErrors(fieldErrors);
    });

    expect(result.current.errors).toEqual(fieldErrors);
    expect(result.current.hasErrors()).toBe(true);
  });

  it('should handle validation error', () => {
    const { result } = renderHook(() => useErrorHandler());

    const error = {
      response: {
        data: {
          errors: {
            name: 'Name is required',
            email: 'Invalid email format',
          },
        },
      },
    };

    act(() => {
      result.current.handleValidationError(error);
    });

    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Invalid email format',
    });
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError({
        response: { data: { message: 'Error' } },
      });
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should clear field error', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleFieldErrors({
        email: 'Invalid email',
        password: 'Too short',
      });
    });

    act(() => {
      result.current.clearFieldError('email');
    });

    expect(result.current.errors).toEqual({ password: 'Too short' });
  });

  it('should clear all errors', () => {
    const { result } = renderHook(() => useErrorHandler());

    act(() => {
      result.current.handleError({
        response: { data: { message: 'Error' } },
      });
      result.current.handleFieldErrors({ email: 'Invalid' });
    });

    expect(result.current.hasErrors()).toBe(true);

    act(() => {
      result.current.clearAllErrors();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.errors).toEqual({});
    expect(result.current.hasErrors()).toBe(false);
  });
});
