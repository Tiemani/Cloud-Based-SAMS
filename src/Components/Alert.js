import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const getAlertClass = () => {
    switch (type) {
      case 'success':
        return 'alert alert-success';
      case 'danger':
      case 'error':
        return 'alert alert-danger';
      case 'warning':
        return 'alert alert-warning';
      case 'info':
        return 'alert alert-info';
      default:
        return 'alert alert-primary';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'danger':
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
        return 'fas fa-info-circle';
      default:
        return 'fas fa-info-circle';
    }
  };

  if (!message) return null;

  return (
    <div className={`${getAlertClass()} alert-dismissible`} role="alert">
      <i className={`${getIcon()} me-2`}></i>
      {message}
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
};

export default Alert;