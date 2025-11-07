import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'new-batch',
      title: 'Nuevo Lote',
      description: 'Crear registro de nuevo lote de producción',
      icon: 'Plus',
      color: 'bg-primary text-primary-foreground',
      route: '/lot-planning',
      action: 'create'
    },
    {
      id: 'report-deviation',
      title: 'Reportar Desviación',
      description: 'Registrar nueva desviación o incidente',
      icon: 'AlertTriangle',
      color: 'bg-warning text-warning-foreground',
      route: '/deviation-management',
      action: 'create'
    },
    {
      id: 'quality-test',
      title: 'Prueba de Calidad',
      description: 'Iniciar nueva validación de calidad',
      icon: 'ShieldCheck',
      color: 'bg-success text-success-foreground',
      route: '/quality-control-validation',
      action: 'create'
    },
    {
      id: 'production-monitor',
      title: 'Monitor de Producción',
      description: 'Ver estado en tiempo real de producción',
      icon: 'Monitor',
      color: 'bg-accent text-accent-foreground',
      route: '/production-traceability',
      action: 'view'
    }
  ];

  const handleActionClick = (action) => {
    navigate(action?.route, { 
      state: { 
        action: action?.action,
        source: 'dashboard' 
      } 
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Zap" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Acciones Rápidas</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={() => handleActionClick(action)}
              className="group p-4 rounded-lg border border-border hover:border-primary/50 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${action?.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon name={action?.icon} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                    {action?.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {action?.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;