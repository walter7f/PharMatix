import React from 'react';
import Icon from '../../../components/AppIcon';

const KPICard = ({ title, value, subtitle, icon, trend, trendValue, severity = 'default', onClick }) => {
  const getSeverityStyles = () => {
    switch (severity) {
      case 'critical':
        return 'border-error bg-error/5';
      case 'warning':
        return 'border-warning bg-warning/5';
      case 'success':
        return 'border-success bg-success/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div 
      className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md cursor-pointer ${getSeverityStyles()}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${severity === 'critical' ? 'bg-error text-error-foreground' : severity === 'warning' ? 'bg-warning text-warning-foreground' : severity === 'success' ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}`}>
            <Icon name={icon} size={20} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={16} />
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <div className="text-3xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default KPICard;