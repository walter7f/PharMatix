import React from 'react';

const AlertBadge = ({ count = 0, severity = 'default', size = 'default', className = '' }) => {
  if (count === 0) return null;

  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return 'bg-error text-error-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      case 'success':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-accent text-accent-foreground';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'h-4 min-w-4 text-xs px-1';
      case 'lg':
        return 'h-7 min-w-7 text-sm px-2';
      default:
        return 'h-5 min-w-5 text-xs px-1.5';
    }
  };

  const displayCount = count > 99 ? '99+' : count?.toString();

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-medium
        ${getSeverityStyles()}
        ${getSizeStyles()}
        ${className}
      `}
      aria-label={`${count} alert${count !== 1 ? 's' : ''}`}
    >
      {displayCount}
    </span>
  );
};

export default AlertBadge;