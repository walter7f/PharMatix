import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductionOverview = () => {
  const [batches] = useState([
    {
      id: 'PH-2024-001',
      product: 'Paracetamol 500mg',
      status: 'En Proceso',
      progress: 75,
      stage: 'Granulación',
      equipment: 'Granulador GR-001',
      operator: 'María González',
      startDate: '12/09/2024',
      expectedCompletion: '15/09/2024',
      priority: 'high',
      alerts: 1
    },
    {
      id: 'PH-2024-002',
      product: 'Ibuprofeno 400mg',
      status: 'Control de Calidad',
      progress: 90,
      stage: 'Pruebas de Disolución',
      equipment: 'Disolutor DS-002',
      operator: 'Carlos Ruiz',
      startDate: '10/09/2024',
      expectedCompletion: '14/09/2024',
      priority: 'medium',
      alerts: 1
    },
    {
      id: 'PH-2024-003',
      product: 'Amoxicilina 250mg',
      status: 'Completado',
      progress: 100,
      stage: 'Empaque Final',
      equipment: 'Empacadora EP-003',
      operator: 'Ana López',
      startDate: '08/09/2024',
      expectedCompletion: '13/09/2024',
      priority: 'low',
      alerts: 0
    },
    {
      id: 'PH-2024-004',
      product: 'Aspirina 100mg',
      status: 'Planificado',
      progress: 0,
      stage: 'Pendiente de Inicio',
      equipment: 'Mezclador MZ-001',
      operator: 'Pedro Martín',
      startDate: '16/09/2024',
      expectedCompletion: '20/09/2024',
      priority: 'medium',
      alerts: 0
    }
  ]);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'En Proceso':
        return {
          color: 'text-accent',
          bgColor: 'bg-accent/10',
          icon: 'Play'
        };
      case 'Control de Calidad':
        return {
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          icon: 'ShieldCheck'
        };
      case 'Completado':
        return {
          color: 'text-success',
          bgColor: 'bg-success/10',
          icon: 'CheckCircle'
        };
      case 'Planificado':
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50',
          icon: 'Clock'
        };
      default:
        return {
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          icon: 'Circle'
        };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error';
      case 'medium':
        return 'border-l-warning';
      case 'low':
        return 'border-l-success';
      default:
        return 'border-l-border';
    }
  };

  const handleViewBatch = (batchId) => {
    console.log('Viewing batch:', batchId);
    // Navigate to batch details
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Factory" size={20} className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Resumen de Producción</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Filter">
              Filtrar
            </Button>
            <Button variant="outline" size="sm" iconName="RefreshCw">
              Actualizar
            </Button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lote</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Producto</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Progreso</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Etapa Actual</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Operador</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Finalización</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {batches?.map((batch) => {
              const statusConfig = getStatusConfig(batch?.status);
              return (
                <tr key={batch?.id} className={`hover:bg-muted/30 transition-colors duration-200 border-l-4 ${getPriorityColor(batch?.priority)}`}>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-medium text-foreground">{batch?.id}</span>
                      {batch?.alerts > 0 && (
                        <span className="px-1.5 py-0.5 bg-error text-error-foreground text-xs font-medium rounded-full">
                          {batch?.alerts}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{batch?.product}</p>
                      <p className="text-xs text-muted-foreground">{batch?.equipment}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${statusConfig?.bgColor}`}>
                      <Icon name={statusConfig?.icon} size={14} className={statusConfig?.color} />
                      <span className={`text-sm font-medium ${statusConfig?.color}`}>{batch?.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{batch?.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            batch?.progress === 100 ? 'bg-success' : 
                            batch?.progress >= 75 ? 'bg-accent' : 
                            batch?.progress >= 50 ? 'bg-warning' : 'bg-muted-foreground'
                          }`}
                          style={{ width: `${batch?.progress}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{batch?.stage}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{batch?.operator}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-foreground">{batch?.expectedCompletion}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewBatch(batch?.id)}
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionOverview;