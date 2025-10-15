import React from 'react';
import Icon from '../../../components/AppIcon';
import AlertBadge from '../../../components/ui/AlertBadge';

const DeviationHeader = ({ deviation, onStatusChange, onPriorityChange }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'text-error bg-error/10 border-error/20';
      case 'Major':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Minor':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'text-error bg-error/10';
      case 'Under Investigation':
        return 'text-warning bg-warning/10';
      case 'CAPA Required':
        return 'text-accent bg-accent/10';
      case 'Closed':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimeRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = Math.ceil((due - now) / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 24) return `${diffHours}h remaining`;
    const days = Math.ceil(diffHours / 24);
    return `${days} days remaining`;
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left Section - Main Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl font-semibold text-foreground">
              Desviación #{deviation?.id}
            </h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(deviation?.severity)}`}>
              {deviation?.severity}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deviation?.status)}`}>
              {deviation?.status}
            </div>
          </div>
          
          <p className="text-foreground mb-4 text-lg">{deviation?.title}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Fecha de Detección</p>
                <p className="text-sm font-medium text-foreground">{deviation?.detectionDate}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Tiempo Límite</p>
                <p className="text-sm font-medium text-foreground">{formatTimeRemaining(deviation?.dueDate)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Icon name="User" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Investigador Asignado</p>
                <p className="text-sm font-medium text-foreground">{deviation?.assignedTo}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-col gap-3 lg:min-w-48">
          <div className="flex items-center gap-2">
            <Icon name="Package" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Lotes Afectados</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-foreground">{deviation?.affectedBatches?.length}</p>
                <AlertBadge count={deviation?.affectedBatches?.length} severity="warning" size="sm" />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Nivel de Riesgo</p>
              <p className="text-sm font-medium text-foreground">{deviation?.riskLevel}</p>
            </div>
          </div>
          
          {deviation?.escalated && (
            <div className="flex items-center gap-2 p-2 bg-error/10 border border-error/20 rounded-md">
              <Icon name="AlertTriangle" size={16} className="text-error" />
              <p className="text-xs text-error font-medium">Escalado a Gerencia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviationHeader;