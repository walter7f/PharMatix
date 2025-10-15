import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RealTimePanel = ({ selectedBatch }) => {
  const [realTimeData, setRealTimeData] = useState({
    equipment: [
      {
        id: 'mixer-01',
        name: 'Mezclador Principal',
        status: 'active',
        temperature: 25.4,
        pressure: 1.2,
        speed: 150,
        lastUpdate: new Date()
      },
      {
        id: 'tablet-press-02',
        name: 'Tableteadora #2',
        status: 'maintenance',
        temperature: 22.1,
        pressure: 0.8,
        speed: 0,
        lastUpdate: new Date()
      },
      {
        id: 'coating-03',
        name: 'Recubridora #3',
        status: 'idle',
        temperature: 24.8,
        pressure: 1.0,
        speed: 75,
        lastUpdate: new Date()
      }
    ],
    environment: {
      temperature: 22.5,
      humidity: 45.2,
      pressure: 1013.25,
      airChanges: 15,
      particleCount: 125
    },
    materials: [
      {
        name: 'Principio Activo A',
        consumed: 45.2,
        remaining: 154.8,
        unit: 'kg',
        batchNumber: 'PA-2024-089'
      },
      {
        name: 'Excipiente B',
        consumed: 12.8,
        remaining: 87.2,
        unit: 'kg',
        batchNumber: 'EX-2024-156'
      },
      {
        name: 'Lubricante C',
        consumed: 2.1,
        remaining: 7.9,
        unit: 'kg',
        batchNumber: 'LU-2024-034'
      }
    ],
    alerts: [
      {
        id: 1,
        type: 'warning',
        message: 'Temperatura del mezclador ligeramente elevada',
        timestamp: new Date(Date.now() - 300000),
        equipment: 'mixer-01'
      },
      {
        id: 2,
        type: 'info',
        message: 'Mantenimiento programado completado',
        timestamp: new Date(Date.now() - 600000),
        equipment: 'tablet-press-02'
      }
    ]
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        equipment: prev?.equipment?.map(eq => ({
          ...eq,
          temperature: eq?.temperature + (Math.random() - 0.5) * 0.5,
          pressure: eq?.pressure + (Math.random() - 0.5) * 0.1,
          lastUpdate: new Date()
        })),
        environment: {
          ...prev?.environment,
          temperature: prev?.environment?.temperature + (Math.random() - 0.5) * 0.2,
          humidity: prev?.environment?.humidity + (Math.random() - 0.5) * 1.0
        }
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'maintenance':
        return 'text-warning bg-warning/10';
      case 'idle':
        return 'text-muted-foreground bg-muted/50';
      case 'error':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Play';
      case 'maintenance':
        return 'Wrench';
      case 'idle':
        return 'Pause';
      case 'error':
        return 'AlertTriangle';
      default:
        return 'Circle';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Equipment Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Estado de Equipos</h3>
          <Button variant="ghost" size="sm" iconName="RefreshCw">
            Actualizar
          </Button>
        </div>
        
        <div className="space-y-4">
          {realTimeData?.equipment?.map((equipment) => (
            <div key={equipment?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(equipment?.status)}`}>
                  <Icon name={getStatusIcon(equipment?.status)} size={16} />
                </div>
                <div>
                  <p className="font-medium text-foreground">{equipment?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Actualizado: {equipment?.lastUpdate?.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-muted-foreground">
                    {equipment?.temperature?.toFixed(1)}°C
                  </span>
                  <span className="text-muted-foreground">
                    {equipment?.pressure?.toFixed(1)} bar
                  </span>
                  <span className="text-muted-foreground">
                    {equipment?.speed} rpm
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Environmental Conditions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Condiciones Ambientales</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Temperatura:</span>
              <span className="font-medium text-foreground">
                {realTimeData?.environment?.temperature?.toFixed(1)}°C
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Humedad:</span>
              <span className="font-medium text-foreground">
                {realTimeData?.environment?.humidity?.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Presión:</span>
              <span className="font-medium text-foreground">
                {realTimeData?.environment?.pressure?.toFixed(2)} hPa
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cambios de Aire:</span>
              <span className="font-medium text-foreground">
                {realTimeData?.environment?.airChanges}/h
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Partículas:</span>
              <span className="font-medium text-foreground">
                {realTimeData?.environment?.particleCount}/m³
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Material Consumption */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Consumo de Materiales</h3>
        
        <div className="space-y-4">
          {realTimeData?.materials?.map((material, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">{material?.name}</span>
                <span className="text-xs text-muted-foreground">{material?.batchNumber}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Consumido: {material?.consumed} {material?.unit}
                </span>
                <span className="text-muted-foreground">
                  Restante: {material?.remaining} {material?.unit}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(material?.consumed / (material?.consumed + material?.remaining)) * 100}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Real-time Alerts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Alertas en Tiempo Real</h3>
        
        <div className="space-y-3">
          {realTimeData?.alerts?.map((alert) => (
            <div key={alert?.id} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Icon 
                name={getAlertIcon(alert?.type)} 
                size={16} 
                className={getAlertColor(alert?.type)} 
              />
              <div className="flex-1">
                <p className="text-sm text-foreground">{alert?.message}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                  <span>{alert?.timestamp?.toLocaleTimeString()}</span>
                  <span>•</span>
                  <span>{alert?.equipment}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RealTimePanel;