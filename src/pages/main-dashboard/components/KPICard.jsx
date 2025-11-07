import React, { useState, useEffect } from 'react';
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

// Hook personalizado para obtener estadísticas de lotes
export const useLoteStats = () => {
  const [stats, setStats] = useState({
    totalLotes: 0,
    lotesEnProceso: 0,
    lotesPorMes: {},
    lotesPorArea: {},
    lotesPorPlanta: {},
    lotesProximosVencer: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchLotes = async () => {
      try {
        const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/lote');
        if (!response.ok) throw new Error('Error al cargar datos');
        
        const data = await response.json();
        
        // Filtrar solo lotes con número asignado (no null)
        const lotesConNumero = data.filter(lote => lote.lote !== null && lote.lote !== '');
        
        // Calcular estadísticas
        const lotesPorMes = {};
        const lotesPorArea = {};
        const lotesPorPlanta = {};
        let lotesProximosVencer = 0;
        
        const hoy = new Date();
        const tresMesesDespues = new Date();
        tresMesesDespues.setMonth(tresMesesDespues.getMonth() + 3);
        
        lotesConNumero.forEach(lote => {
          // Contar por mes de planificación
          if (lote.planificacion) {
            lotesPorMes[lote.planificacion] = (lotesPorMes[lote.planificacion] || 0) + 1;
          }
          
          // Contar por área de fabricación
          if (lote.areaFabricacion) {
            lotesPorArea[lote.areaFabricacion] = (lotesPorArea[lote.areaFabricacion] || 0) + 1;
          }
          
          // Contar por planta
          if (lote.planta) {
            lotesPorPlanta[lote.planta] = (lotesPorPlanta[lote.planta] || 0) + 1;
          }
          
          // Contar lotes próximos a vencer (en los próximos 3 meses)
          if (lote.vencimiento) {
            const fechaVencimiento = new Date(lote.vencimiento);
            if (fechaVencimiento >= hoy && fechaVencimiento <= tresMesesDespues) {
              lotesProximosVencer++;
            }
          }
        });
        
        setStats({
          totalLotes: lotesConNumero.length,
          lotesEnProceso: lotesConNumero.filter(l => !l.fechaFinalizado).length,
          lotesPorMes,
          lotesPorArea,
          lotesPorPlanta,
          lotesProximosVencer,
          loading: false,
          error: null
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    fetchLotes();
    
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchLotes, 300000);
    
    return () => clearInterval(interval);
  }, []);

  return stats;
};

// Componente contenedor para mostrar múltiples KPIs
export const KPIContainer = () => {
  const stats = useLoteStats();

  if (stats.loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="p-6 rounded-lg border-2 border-border bg-card animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="p-6 rounded-lg border-2 border-error bg-error/5">
        <p className="text-error">Error al cargar estadísticas: {stats.error}</p>
      </div>
    );
  }

  const mesActual = new Date().toLocaleDateString('es-ES', { month: 'long' });
  const mesActualCapitalizado = mesActual.charAt(0).toUpperCase() + mesActual.slice(1);
  const lotesMesActual = stats.lotesPorMes[mesActualCapitalizado] || 0;

  // Calcular severidad para lotes próximos a vencer
  const getSeverityVencimiento = () => {
    if (stats.lotesProximosVencer > 10) return 'critical';
    if (stats.lotesProximosVencer > 5) return 'warning';
    return 'default';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total de Lotes"
        value={stats.totalLotes}
        subtitle="Lotes con número asignado"
        icon="Package"
        severity="success"
        trend="up"
        trendValue={`+${stats.totalLotes}`}
      />
      
      <KPICard
        title="Lotes en Proceso"
        value={stats.lotesEnProceso}
        subtitle="Sin fecha de finalización"
        icon="Clock"
        severity={stats.lotesEnProceso > 20 ? 'warning' : 'default'}
        trend={stats.lotesEnProceso > 0 ? 'up' : 'neutral'}
        trendValue={`${stats.lotesEnProceso} activos`}
      />
      
      <KPICard
        title={`Lotes ${mesActualCapitalizado}`}
        value={lotesMesActual}
        subtitle="Planificados este mes"
        icon="Calendar"
        severity="default"
        trend={lotesMesActual > 0 ? 'up' : 'neutral'}
        trendValue={`${lotesMesActual} lotes`}
      />
      
      <KPICard
        title="Próximos a Vencer"
        value={stats.lotesProximosVencer}
        subtitle="En los próximos 3 meses"
        icon="AlertTriangle"
        severity={getSeverityVencimiento()}
        trend={stats.lotesProximosVencer > 0 ? 'down' : 'neutral'}
        trendValue={`${stats.lotesProximosVencer} lotes`}
      />
    </div>
  );
};

export default KPICard;