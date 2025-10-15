import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import AlertBadge from '../../../components/ui/AlertBadge';

const RelatedDeviations = ({ currentDeviationId, onViewDeviation }) => {
  const [viewMode, setViewMode] = useState('related'); // 'related', 'trending'

  const relatedDeviations = [
    {
      id: 'DEV-2025-002',
      title: 'Variación en Temperatura de Almacenamiento',
      severity: 'Major',
      status: 'Closed',
      detectionDate: '2025-01-08',
      similarity: 85,
      affectedBatches: ['LOT-2025-008', 'LOT-2025-009'],
      rootCause: 'Falla en sensor de temperatura'
    },
    {
      id: 'DEV-2025-005',
      title: 'Desviación en Tiempo de Mezclado',
      severity: 'Minor',
      status: 'Under Investigation',
      detectionDate: '2025-01-10',
      similarity: 72,
      affectedBatches: ['LOT-2025-012'],
      rootCause: 'Error de operador'
    },
    {
      id: 'DEV-2024-156',
      title: 'Contaminación Cruzada en Línea 2',
      severity: 'Critical',
      status: 'CAPA Required',
      detectionDate: '2024-12-28',
      similarity: 68,
      affectedBatches: ['LOT-2024-298', 'LOT-2024-299', 'LOT-2024-300'],
      rootCause: 'Procedimiento de limpieza inadecuado'
    }
  ];

  const trendingData = [
    {
      category: 'Equipos',
      count: 12,
      trend: 'up',
      percentage: 15,
      mostCommon: 'Fallas de sensores',
      period: 'Últimos 3 meses'
    },
    {
      category: 'Procesos',
      count: 8,
      trend: 'down',
      percentage: 8,
      mostCommon: 'Desviaciones de temperatura',
      period: 'Últimos 3 meses'
    },
    {
      category: 'Personal',
      count: 5,
      trend: 'stable',
      percentage: 0,
      mostCommon: 'Errores de documentación',
      period: 'Últimos 3 meses'
    },
    {
      category: 'Materiales',
      count: 3,
      trend: 'up',
      percentage: 25,
      mostCommon: 'Especificaciones fuera de rango',
      period: 'Últimos 3 meses'
    }
  ];

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

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return { icon: 'TrendingUp', color: 'text-error' };
      case 'down':
        return { icon: 'TrendingDown', color: 'text-success' };
      default:
        return { icon: 'Minus', color: 'text-muted-foreground' };
    }
  };

  const renderRelatedDeviations = () => (
    <div className="space-y-4">
      {relatedDeviations?.map((deviation) => (
        <div key={deviation?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-200">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-medium text-foreground">{deviation?.id}</h4>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(deviation?.severity)}`}>
                  {deviation?.severity}
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deviation?.status)}`}>
                  {deviation?.status}
                </div>
              </div>
              <p className="text-sm text-foreground mb-2">{deviation?.title}</p>
              <p className="text-xs text-muted-foreground mb-2">{deviation?.rootCause}</p>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-1 mb-1">
                <Icon name="Zap" size={12} className="text-accent" />
                <span className="text-xs font-medium text-accent">{deviation?.similarity}% similar</span>
              </div>
              <p className="text-xs text-muted-foreground">{deviation?.detectionDate}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Package" size={14} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {deviation?.affectedBatches?.length} lote(s) afectado(s)
              </span>
              <AlertBadge count={deviation?.affectedBatches?.length} size="sm" />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDeviation(deviation?.id)}
              iconName="ExternalLink"
              iconPosition="right"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrendingAnalysis = () => (
    <div className="space-y-4">
      {trendingData?.map((trend, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">{trend?.category}</h4>
            <div className="flex items-center gap-2">
              <Icon 
                name={getTrendIcon(trend?.trend)?.icon} 
                size={16} 
                className={getTrendIcon(trend?.trend)?.color} 
              />
              <span className={`text-sm font-medium ${getTrendIcon(trend?.trend)?.color}`}>
                {trend?.percentage > 0 ? `+${trend?.percentage}%` : trend?.percentage === 0 ? '0%' : `${trend?.percentage}%`}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-muted-foreground">Total Desviaciones</p>
              <p className="text-lg font-semibold text-foreground">{trend?.count}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Más Común</p>
              <p className="text-sm text-foreground">{trend?.mostCommon}</p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">{trend?.period}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Análisis Relacionado</h3>
          
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('related')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'related' ?'bg-surface text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Relacionadas
            </button>
            <button
              onClick={() => setViewMode('trending')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                viewMode === 'trending' ?'bg-surface text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Tendencias
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {viewMode === 'related' ? renderRelatedDeviations() : renderTrendingAnalysis()}
        
        {viewMode === 'related' && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="Search"
              iconPosition="left"
              fullWidth
            >
              Buscar Más Desviaciones Relacionadas
            </Button>
          </div>
        )}
        
        {viewMode === 'trending' && (
          <div className="mt-6 pt-4 border-t border-border">
            <Button
              variant="outline"
              iconName="BarChart3"
              iconPosition="left"
              fullWidth
            >
              Ver Reporte Completo de Tendencias
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedDeviations;