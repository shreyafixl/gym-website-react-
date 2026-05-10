import React from 'react';
import '../styles/loading-spinner.css';

/**
 * Loading Spinner Component
 * Displays a loading indicator
 */
const LoadingSpinner = ({ size = 'medium', fullScreen = false }) => {
  const spinnerClass = `spinner spinner-${size}`;

  if (fullScreen) {
    return (
      <div className="spinner-container-fullscreen">
        <div className={spinnerClass}></div>
      </div>
    );
  }

  return <div className={spinnerClass}></div>;
};

export default LoadingSpinner;
