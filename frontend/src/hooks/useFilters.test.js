import { renderHook, act } from '@testing-library/react';
import useFilters from './useFilters';

describe('useFilters', () => {
  it('should initialize with empty filters', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.filters).toEqual({});
    expect(result.current.hasFilters()).toBe(false);
  });

  it('should initialize with initial filters', () => {
    const initialFilters = { role: 'member', status: 'active' };
    const { result } = renderHook(() => useFilters(initialFilters));

    expect(result.current.filters).toEqual(initialFilters);
    expect(result.current.hasFilters()).toBe(true);
  });

  it('should update single filter', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilter('role', 'member');
    });

    expect(result.current.filters).toEqual({ role: 'member' });
  });

  it('should update multiple filters', () => {
    const { result } = renderHook(() => useFilters());

    act(() => {
      result.current.updateFilters({ role: 'member', status: 'active' });
    });

    expect(result.current.filters).toEqual({ role: 'member', status: 'active' });
  });

  it('should remove filter', () => {
    const { result } = renderHook(() => useFilters({ role: 'member', status: 'active' }));

    act(() => {
      result.current.removeFilter('role');
    });

    expect(result.current.filters).toEqual({ status: 'active' });
  });

  it('should clear all filters', () => {
    const { result } = renderHook(() => useFilters({ role: 'member', status: 'active' }));

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.hasFilters()).toBe(false);
  });

  it('should detect if filters exist', () => {
    const { result } = renderHook(() => useFilters());

    expect(result.current.hasFilters()).toBe(false);

    act(() => {
      result.current.updateFilter('role', 'member');
    });

    expect(result.current.hasFilters()).toBe(true);
  });
});
