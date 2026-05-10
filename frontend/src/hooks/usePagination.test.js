import { renderHook, act } from '@testing-library/react';
import usePagination from './usePagination';

describe('usePagination', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePagination());

    expect(result.current.page).toBe(1);
    expect(result.current.perPage).toBe(20);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });

  it('should initialize with custom values', () => {
    const { result } = renderHook(() => usePagination(2, 50));

    expect(result.current.page).toBe(2);
    expect(result.current.perPage).toBe(50);
  });

  it('should calculate total pages correctly', () => {
    const { result } = renderHook(() => usePagination(1, 20));

    act(() => {
      result.current.updateTotal(100);
    });

    expect(result.current.totalPages).toBe(5);
  });

  it('should navigate to next page', () => {
    const { result } = renderHook(() => usePagination(1, 20));

    act(() => {
      result.current.updateTotal(100);
    });

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.page).toBe(2);
  });

  it('should navigate to previous page', () => {
    const { result } = renderHook(() => usePagination(2, 20));

    act(() => {
      result.current.updateTotal(100);
      result.current.prevPage();
    });

    expect(result.current.page).toBe(1);
  });

  it('should go to specific page', () => {
    const { result } = renderHook(() => usePagination(1, 20));

    act(() => {
      result.current.updateTotal(100);
    });

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.page).toBe(3);
  });

  it('should not go beyond last page', () => {
    const { result } = renderHook(() => usePagination(1, 20));

    act(() => {
      result.current.updateTotal(100);
      result.current.goToPage(10);
    });

    expect(result.current.page).toBe(1); // Should not change
  });

  it('should change per page and reset to page 1', () => {
    const { result } = renderHook(() => usePagination(3, 20));

    act(() => {
      result.current.updateTotal(100);
      result.current.changePerPage(50);
    });

    expect(result.current.page).toBe(1);
    expect(result.current.perPage).toBe(50);
  });

  it('should reset pagination', () => {
    const { result } = renderHook(() => usePagination(1, 20));

    act(() => {
      result.current.updateTotal(100);
      result.current.goToPage(3);
      result.current.reset();
    });

    expect(result.current.page).toBe(1);
    expect(result.current.perPage).toBe(20);
    expect(result.current.total).toBe(0);
  });
});
