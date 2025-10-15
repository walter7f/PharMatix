import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AuditActivities = () => {
  const [activities] = useState([
    {
      id: 1,
      type: 'batch_record',
      action: 'Registro de lote creado',
      details: 'Lote PH-2024-001 - Paracetamol 500mg registrado en el sistema',
      user: 'María González',
      timestamp: new Date('2024-09-14T03:30:00'),
      module: 'Producción',
      severity: 'info'
    },
    {
      id: 2,
      type: 'quality_test',
      action: 'Prueba de calidad completada',
      details: 'Pruebas de disolución aprobadas para lote PH-2024-002',
      user: 'Dr. Carlos Ruiz',
      timestamp: new Date('2024-09-14T02:15:00'),
      module: 'Control de Calidad',
      severity: 'success'
    },
    {
      id: 3,
      type: 'deviation',
      action: 'Desviación reportada',
      details: 'Desviación menor en procedimiento SOP-QC-015 - Tiempo de muestreo excedido',
      user: 'Ana López',
      timestamp: new Date('2024-09-14T01:45:00'),
      module: 'Desviaciones',
      severity: 'warning'
    },
    {
      id: 4,
      type: 'equipment',
      action: 'Calibración de equipo',
      details: 'Balanza analítica AN-001 calibrada exitosamente',
      user: 'Pedro Martín',
      timestamp: new Date('2024-09-13T23:30:00'),
      module: 'Equipos',
      severity: 'success'
    },
    {
      id: 5,
      type: 'user_access',
      action: 'Acceso al sistema',
      details: 'Inicio de sesión desde estación de trabajo QC-LAB-02',
      user: 'Dr. Sarah Chen',
      timestamp: new Date('2024-09-13T22:15:00'),
      module: 'Sistema',
      severity: 'info'
    }
  ]);

  const [upcomingDeadlines] = useState([
    {
      id: 1,
      title: 'Revisión regulatoria trimestral',
      description: 'Revisión de cumplimiento normativo Q3 2024',
      dueDate: new Date('2024-09-20T23:59:59'),
      priority: 'high',
      assignee: 'Departamento Regulatorio',
      status: 'pending'
    },
    {
      id: 2,
      title: 'Calibración de equipos críticos',
      description: 'Calibración programada para equipos de análisis',
      dueDate: new Date('2024-09-18T16:00:00'),
      priority: 'medium',
      assignee: 'Mantenimiento',
      status: 'in_progress'
    },
    {
      id: 3,
      title: 'Auditoría interna de calidad',
      description: 'Auditoría mensual del sistema de gestión de calidad',
      dueDate: new Date('2024-09-25T09:00:00'),
      priority: 'medium',
      assignee: 'Equipo de Auditoría',
      status: 'scheduled'
    }
  ]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'batch_record':
        return 'FileText';
      case 'quality_test':
        return 'ShieldCheck';
      case 'deviation':
        return 'AlertTriangle';
      case 'equipment':
        return 'Settings';
      case 'user_access':
        return 'User';
      default:
        return 'Activity';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-accent';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-error text-error';
      case 'medium':
        return 'border-l-warning text-warning';
      case 'low':
        return 'border-l-success text-success';
      default:
        return 'border-l-border text-muted-foreground';
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

  const getTimeUntilDeadline = (date) => {
    const now = new Date();
    const diff = date?.getTime() - now?.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Vencido';
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    return `${days} días`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Recent Audit Activities */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Activity" size={20} className="text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Actividades Recientes</h3>
            </div>
            <Button variant="outline" size="sm" iconName="ExternalLink">
              Ver Todo
            </Button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <div className="divide-y divide-border">
            {activities?.map((activity) => (
              <div key={activity?.id} className="p-4 hover:bg-muted/30 transition-colors duration-200">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-muted ${getSeverityColor(activity?.severity)}`}>
                    <Icon name={getActivityIcon(activity?.type)} size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-foreground">{activity?.action}</h4>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(activity?.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{activity?.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{activity?.user}</span>
                      <span>•</span>
                      <span>{activity?.module}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Upcoming Regulatory Deadlines */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Icon name="Calendar" size={20} className="text-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Fechas Límite Regulatorias</h3>
            </div>
            <Button variant="outline" size="sm" iconName="Plus">
              Agregar
            </Button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          <div className="divide-y divide-border">
            {upcomingDeadlines?.map((deadline) => (
              <div key={deadline?.id} className={`p-4 border-l-4 ${getPriorityColor(deadline?.priority)} hover:bg-muted/30 transition-colors duration-200`}>
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-foreground">{deadline?.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${getPriorityColor(deadline?.priority)}`}>
                          {getTimeUntilDeadline(deadline?.dueDate)}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{deadline?.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{deadline?.assignee}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(deadline?.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditActivities;