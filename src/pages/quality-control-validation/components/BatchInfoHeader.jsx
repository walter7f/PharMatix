import React from 'react';
import Icon from '../../../components/AppIcon';
import AlertBadge from '../../../components/ui/AlertBadge';

const BatchInfoHeader = ({ batchData, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'in progress':
        return 'text-warning bg-warning/10';
      case 'passed':
        return 'text-success bg-success/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getComplianceIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'passed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'in progress':
        return 'Clock';
      default:
        return 'AlertCircle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="FlaskConical" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">{batchData?.batchNumber}</h2>
            <p className="text-sm text-muted-foreground">{batchData?.productName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(batchData?.status)}`}>
            <Icon name={getComplianceIcon(batchData?.status)} size={16} />
            <span>{batchData?.status}</span>
          </div>
          {batchData?.deviationCount > 0 && (
            <AlertBadge count={batchData?.deviationCount} severity="warning" />
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lote de Producción</p>
          <p className="text-sm font-medium text-foreground">{batchData?.productionLot}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha de Fabricación</p>
          <p className="text-sm font-medium text-foreground">{batchData?.manufacturingDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fecha de Vencimiento</p>
          <p className="text-sm font-medium text-foreground">{batchData?.expiryDate}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cantidad</p>
          <p className="text-sm font-medium text-foreground">{batchData?.quantity}</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="User" size={14} />
            <span>Responsable: {batchData?.qualityManager}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={14} />
            <span>Última actualización: {batchData?.lastUpdated}</span>
          </div>
        </div>
        
        <button
          onClick={onViewDetails}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
        >
          <Icon name="Eye" size={16} />
          <span>Ver Detalles</span>
        </button>
      </div>
    </div>
  );
};

export default BatchInfoHeader;