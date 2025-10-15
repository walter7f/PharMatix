import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Temperatura fuera de rango - Lote PH-2024-001",
      description: "La temperatura del reactor ha excedido los límites establecidos (32°C registrado, límite: 25-30°C)",
      severity: 'critical',
      timestamp: new Date('2024-09-14T03:45:00'),
      acknowledged: false,
      module: 'production',
      batchId: 'PH-2024-001'
    },
    {
      id: 2,
      title: "Validación de calidad pendiente - Lote PH-2024-002",
      description: "Pruebas de disolución requieren aprobación del supervisor de calidad",
      severity: 'warning',
      timestamp: new Date('2024-09-14T02:30:00'),
      acknowledged: false,
      module: 'quality',
      batchId: 'PH-2024-002'
    },
    {
      id: 3,
      title: "Calibración de equipo vencida - Balanza AN-001",
      description: "La calibración del equipo AN-001 venció el 12/09/2024. Requiere recalibración inmediata",
      severity: 'warning',
      timestamp: new Date('2024-09-14T01:15:00'),
      acknowledged: false,
      module: 'equipment',
      equipmentId: 'AN-001'
    },
    {
      id: 4,
      title: "Desviación reportada - Procedimiento SOP-QC-015",
      description: "Se reportó una desviación menor en el procedimiento de muestreo",
      severity: 'info',
      timestamp: new Date('2024-09-13T23:45:00'),
      acknowledged: true,
      module: 'deviation',
      sopId: 'SOP-QC-015'
    }
  ]);

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical':
        return {
          color: 'text-error',
          bgColor: 'bg-error/10',
          borderColor: 'border-error',
          icon: 'AlertTriangle'
        };
      case 'warning':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning',
          icon: 'AlertCircle'
        };
      case 'info':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          borderColor: 'border-accent',
          icon: 'Info'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          icon: 'Bell'
        };
    }
  };

  const formatTimestamp = (date) => {
    return date?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleViewDetails = (alert) => {
    // Navigate to relevant module based on alert type
    console.log('Viewing details for alert:', alert);
  };

  const unacknowledgedAlerts = alerts?.filter(alert => !alert?.acknowledged);
  const acknowledgedAlerts = alerts?.filter(alert => alert?.acknowledged);

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Bell" size={20} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Alertas Críticas</h2>
            {unacknowledgedAlerts?.length > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded-full">
                {unacknowledgedAlerts?.length}
              </span>
            )}
          </div>
          <Button variant="outline" size="sm" iconName="Settings">
            Configurar
          </Button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {unacknowledgedAlerts?.length === 0 && acknowledgedAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <p className="text-muted-foreground">No hay alertas activas</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Unacknowledged Alerts */}
            {unacknowledgedAlerts?.map((alert) => {
              const config = getSeverityConfig(alert?.severity);
              return (
                <div key={alert?.id} className={`p-4 ${config?.bgColor} border-l-4 ${config?.borderColor}`}>
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon name={config?.icon} size={20} className={config?.color} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1">{alert?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatTimestamp(alert?.timestamp)}</span>
                          <span className="capitalize">{alert?.module}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(alert)}
                      >
                        Ver Detalles
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleAcknowledge(alert?.id)}
                      >
                        Reconocer
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Acknowledged Alerts */}
            {acknowledgedAlerts?.map((alert) => {
              const config = getSeverityConfig(alert?.severity);
              return (
                <div key={alert?.id} className="p-4 opacity-60">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <Icon name="CheckCircle" size={20} className="text-success" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1 line-through">{alert?.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>{formatTimestamp(alert?.timestamp)}</span>
                          <span className="capitalize">{alert?.module}</span>
                          <span className="text-success">• Reconocida</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;