import React from 'react';
import Icon from '../../../components/AppIcon';

const BatchHeader = ({ batchData, onStatusChange }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      case 'approved':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressPercentage = () => {
    const completedSteps = batchData?.manufacturingSteps?.filter(step => step?.status === 'completed')?.length;
    return Math.round((completedSteps / batchData?.manufacturingSteps?.length) * 100);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batch Information */}
        <div className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Lote {batchData?.batchNumber}
              </h1>
              <p className="text-lg text-muted-foreground">{batchData?.productName}</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(batchData?.status)}`}>
              {batchData?.status === 'in-progress' ? 'En Progreso' : 
               batchData?.status === 'completed' ? 'Completado' :
               batchData?.status === 'approved' ? 'Aprobado' : 'Pendiente'}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Cantidad Planificada</p>
              <p className="text-lg font-medium text-foreground">{batchData?.plannedQuantity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
              <p className="text-lg font-medium text-foreground">{batchData?.startDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha Objetivo</p>
              <p className="text-lg font-medium text-foreground">{batchData?.targetDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Supervisor</p>
              <p className="text-lg font-medium text-foreground">{batchData?.supervisor}</p>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-foreground">Progreso del Lote</h3>
            <span className="text-2xl font-bold text-primary">{getProgressPercentage()}%</span>
          </div>
          
          <div className="w-full bg-background rounded-full h-2 mb-4">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pasos Completados</span>
              <span className="text-foreground font-medium">
                {batchData?.manufacturingSteps?.filter(step => step?.status === 'completed')?.length} / {batchData?.manufacturingSteps?.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Firmas Requeridas</span>
              <span className="text-foreground font-medium">
                {batchData?.signaturesRequired - batchData?.signaturesCompleted} pendientes
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Icon name="FileSignature" size={16} />
          <span>Firmar Paso</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors">
          <Icon name="AlertTriangle" size={16} />
          <span>Reportar Desviación</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-accent-foreground rounded-md hover:bg-accent/90 transition-colors">
          <Icon name="Download" size={16} />
          <span>Exportar Registro</span>
        </button>
      </div>
    </div>
  );
};

export default BatchHeader;