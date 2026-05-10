import { useState, useCallback } from 'react';

/**
 * Custom hook for notifications
 * Manages notification state and display logic
 */
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration = 3000) => {
      return addNotification(message, 'success', duration);
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, duration = 5000) => {
      return addNotification(message, 'error', duration);
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, duration = 4000) => {
      return addNotification(message, 'warning', duration);
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, duration = 3000) => {
      return addNotification(message, 'info', duration);
    },
    [addNotification]
  );

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };
};

export default useNotification;
