import { renderHook, act } from '@testing-library/react';
import useNotification from './useNotification';

describe('useNotification', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should initialize with no notifications', () => {
    const { result } = renderHook(() => useNotification());

    expect(result.current.notifications).toEqual([]);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification('Test message', 'info', 0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].message).toBe('Test message');
    expect(result.current.notifications[0].type).toBe('info');
  });

  it('should auto-remove notification after duration', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification('Test message', 'info', 3000);
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should remove notification manually', () => {
    const { result } = renderHook(() => useNotification());

    let notificationId;
    act(() => {
      notificationId = result.current.addNotification('Test message', 'info', 0);
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.removeNotification(notificationId);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should show success notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showSuccess('Success message', 0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[0].message).toBe('Success message');
  });

  it('should show error notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showError('Error message', 0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('error');
    expect(result.current.notifications[0].message).toBe('Error message');
  });

  it('should show warning notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showWarning('Warning message', 0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('warning');
  });

  it('should show info notification', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.showInfo('Info message', 0);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('info');
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useNotification());

    act(() => {
      result.current.addNotification('Message 1', 'info', 0);
      result.current.addNotification('Message 2', 'success', 0);
      result.current.addNotification('Message 3', 'error', 0);
    });

    expect(result.current.notifications).toHaveLength(3);

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.notifications).toHaveLength(0);
  });
});
