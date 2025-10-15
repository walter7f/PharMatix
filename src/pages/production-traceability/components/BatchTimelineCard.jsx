import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BatchTimelineCard = ({ step, isExpanded, onToggle, onSignature, onDeviation }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10 border-success/20';
      case 'in-progress':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'pending':
        return 'text-muted-foreground bg-muted border-border';
      case 'deviation':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'in-progress':
        return 'Clock';
      case 'pending':
        return 'Circle';
      case 'deviation':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStatusColor(step?.status)}`}>
            <Icon name={getStatusIcon(step?.status)} size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">{step?.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{step?.description}</p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>{step?.startTime} - {step?.endTime || 'En progreso'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="User" size={12} />
                <span>{step?.operator}</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {step?.requiresSignature && !step?.signed && (
            <Button
              variant="outline"
              size="sm"
              iconName="PenTool"
              onClick={() => onSignature(step?.id)}
            >
              Firmar
            </Button>
          )}
          {step?.status === 'deviation' && (
            <Button
              variant="destructive"
              size="sm"
              iconName="AlertTriangle"
              onClick={() => onDeviation(step?.id)}
            >
              Ver Desviación
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => onToggle(step?.id)}
          >
            {isExpanded ? 'Ocultar' : 'Detalles'}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Parámetros del Proceso</h4>
              {step?.parameters?.map((param, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{param?.name}:</span>
                  <span className={`font-medium ${param?.inSpec ? 'text-success' : 'text-error'}`}>
                    {param?.value} {param?.unit}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Materiales Utilizados</h4>
              {step?.materials?.map((material, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{material?.name}:</span>
                  <span className="font-medium text-foreground">
                    {material?.quantity} {material?.unit}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Controles de Calidad</h4>
              {step?.qualityChecks?.map((check, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{check?.name}:</span>
                  <span className={`font-medium ${check?.passed ? 'text-success' : 'text-error'}`}>
                    {check?.passed ? 'Aprobado' : 'Rechazado'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {step?.notes && (
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-foreground mb-2">Notas del Operador</h4>
              <p className="text-sm text-muted-foreground">{step?.notes}</p>
            </div>
          )}

          {step?.attachments && step?.attachments?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-2">Documentos Adjuntos</h4>
              <div className="flex flex-wrap gap-2">
                {step?.attachments?.map((attachment, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    iconName="FileText"
                    className="text-xs"
                  >
                    {attachment?.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchTimelineCard;