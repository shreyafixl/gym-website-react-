import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import '../styles/success-alert.css';

/**
 * Success Alert Component
 * Displays success messages with auto-dismiss
 */
const SuccessAlert = ({ message, onClose, autoDismiss = true, duration = 3000 }) => {
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
    <div className="success-alert">
      <div className="success-alert-content">
        <FaCheckCircle className="success-alert-icon" />
        <span className="success-alert-message">{message}</span>
        <button
          className="success-alert-close"
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

export default SuccessAlert;
