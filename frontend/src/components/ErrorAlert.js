import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import '../styles/error-alert.css';

/**
 * Error Alert Component
 * Displays error messages with auto-dismiss
 */
const ErrorAlert = ({ message, onClose, autoDismiss = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="error-alert">
      <div className="error-alert-content">
        <span className="error-alert-message">{message}</span>
        <button
          className="error-alert-close"
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ErrorAlert;
