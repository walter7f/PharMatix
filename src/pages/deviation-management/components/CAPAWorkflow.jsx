import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const CAPAWorkflow = ({ deviation, onUpdateCAPA, onApproveCAPA }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [capaData, setCAPAData] = useState({
    correctiveActions: [
      {
        id: 1,
        description: 'Calibrar sensor de temperatura del equipo',
        assignedTo: 'Carlos Ruiz',
        dueDate: '2025-01-20',
        status: 'In Progress',
        priority: 'High',
        completionDate: null
      },
      {
        id: 2,
        description: 'Revisar procedimiento de monitoreo',
        assignedTo: 'Ana Martínez',
        dueDate: '2025-01-25',
        status: 'Pending',
        priority: 'Medium',
        completionDate: null
      }
    ],
    preventiveActions: [
      {
        id: 3,
        description: 'Implementar sistema de alertas tempranas',
        assignedTo: 'Luis Fernández',
        dueDate: '2025-02-15',
        status: 'Planning',
        priority: 'High',
        completionDate: null
      },
      {
        id: 4,
        description: 'Capacitación adicional para operadores',
        assignedTo: 'María González',
        dueDate: '2025-02-28',
        status: 'Planning',
        priority: 'Medium',
        completionDate: null
      }
    ],
    effectivenessReview: {
      reviewDate: '2025-03-15',
      reviewer: 'Dr. Sarah Chen',
      criteria: [
        'Reducción en desviaciones similares',
        'Mejora en indicadores de proceso',
        'Cumplimiento de cronograma',
        'Satisfacción del personal'
      ],
      status: 'Pending'
    }
  });

  const [newAction, setNewAction] = useState({
    type: 'corrective',
    description: '',
    assignedTo: '',
    dueDate: '',
    priority: 'Medium'
  });

  const workflowSteps = [
    { id: 1, title: 'Acciones Correctivas', icon: 'Tool', status: 'active' },
    { id: 2, title: 'Acciones Preventivas', icon: 'Shield', status: 'pending' },
    { id: 3, title: 'Revisión de Efectividad', icon: 'CheckCircle', status: 'pending' },
    { id: 4, title: 'Aprobación Final', icon: 'Award', status: 'pending' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-success bg-success/10';
      case 'In Progress':
        return 'text-warning bg-warning/10';
      case 'Pending':
        return 'text-muted-foreground bg-muted';
      case 'Planning':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-error bg-error/10 border-error/20';
      case 'Medium':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'Low':
        return 'text-success bg-success/10 border-success/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const handleAddAction = () => {
    if (newAction?.description && newAction?.assignedTo && newAction?.dueDate) {
      const actionId = Date.now();
      const actionType = newAction?.type === 'corrective' ? 'correctiveActions' : 'preventiveActions';
      
      setCAPAData(prev => ({
        ...prev,
        [actionType]: [
          ...prev?.[actionType],
          {
            id: actionId,
            ...newAction,
            status: 'Pending',
            completionDate: null
          }
        ]
      }));
      
      setNewAction({
        type: 'corrective',
        description: '',
        assignedTo: '',
        dueDate: '',
        priority: 'Medium'
      });
    }
  };

  const renderActionsList = (actions, type) => (
    <div className="space-y-4">
      {actions?.map((action) => (
        <div key={action?.id} className="border border-border rounded-lg p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2">{action?.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="User" size={12} />
                  {action?.assignedTo}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  Vence: {action?.dueDate}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(action?.priority)}`}>
                {action?.priority}
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(action?.status)}`}>
                {action?.status}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Edit"
              iconPosition="left"
            >
              Editar
            </Button>
            
            {action?.status !== 'Completed' && (
              <Button
                variant="ghost"
                size="sm"
                iconName="Check"
                iconPosition="left"
              >
                Marcar Completada
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="MessageSquare"
              iconPosition="left"
            >
              Comentarios
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-4">Agregar Nueva Acción Correctiva</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Descripción"
                  type="text"
                  placeholder="Describa la acción correctiva"
                  value={newAction?.description}
                  onChange={(e) => setNewAction(prev => ({ ...prev, description: e?.target?.value }))}
                  required
                />
                
                <Input
                  label="Asignado a"
                  type="text"
                  placeholder="Nombre del responsable"
                  value={newAction?.assignedTo}
                  onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e?.target?.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Fecha de Vencimiento"
                  type="date"
                  value={newAction?.dueDate}
                  onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e?.target?.value }))}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prioridad</label>
                  <select
                    value={newAction?.priority}
                    onChange={(e) => setNewAction(prev => ({ ...prev, priority: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="High">Alta</option>
                    <option value="Medium">Media</option>
                    <option value="Low">Baja</option>
                  </select>
                </div>
              </div>
              
              <Button
                variant="default"
                onClick={handleAddAction}
                iconName="Plus"
                iconPosition="left"
                size="sm"
              >
                Agregar Acción
              </Button>
            </div>
            {renderActionsList(capaData?.correctiveActions, 'corrective')}
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-4">Agregar Nueva Acción Preventiva</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Descripción"
                  type="text"
                  placeholder="Describa la acción preventiva"
                  value={newAction?.description}
                  onChange={(e) => setNewAction(prev => ({ ...prev, description: e?.target?.value, type: 'preventive' }))}
                  required
                />
                
                <Input
                  label="Asignado a"
                  type="text"
                  placeholder="Nombre del responsable"
                  value={newAction?.assignedTo}
                  onChange={(e) => setNewAction(prev => ({ ...prev, assignedTo: e?.target?.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Fecha de Vencimiento"
                  type="date"
                  value={newAction?.dueDate}
                  onChange={(e) => setNewAction(prev => ({ ...prev, dueDate: e?.target?.value }))}
                  required
                />
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Prioridad</label>
                  <select
                    value={newAction?.priority}
                    onChange={(e) => setNewAction(prev => ({ ...prev, priority: e?.target?.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="High">Alta</option>
                    <option value="Medium">Media</option>
                    <option value="Low">Baja</option>
                  </select>
                </div>
              </div>
              
              <Button
                variant="default"
                onClick={handleAddAction}
                iconName="Plus"
                iconPosition="left"
                size="sm"
              >
                Agregar Acción
              </Button>
            </div>
            {renderActionsList(capaData?.preventiveActions, 'preventive')}
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-4">Revisión de Efectividad</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Fecha de Revisión</p>
                  <p className="text-sm font-medium text-foreground">{capaData?.effectivenessReview?.reviewDate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Revisor Asignado</p>
                  <p className="text-sm font-medium text-foreground">{capaData?.effectivenessReview?.reviewer}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-foreground mb-3">Criterios de Evaluación</p>
                <div className="space-y-2">
                  {capaData?.effectivenessReview?.criteria?.map((criterion, index) => (
                    <Checkbox
                      key={index}
                      label={criterion}
                     
                    />
                  ))}
                </div>
              </div>
              
              <Input
                label="Comentarios de Revisión"
                type="textarea"
                placeholder="Ingrese observaciones sobre la efectividad de las acciones implementadas..."
                className="min-h-24"
              />
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-4">Aprobación Final del CAPA</h4>
              
              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <h5 className="text-sm font-medium text-foreground">Resumen de Completitud</h5>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Acciones Correctivas</p>
                    <p className="font-medium text-foreground">
                      {capaData?.correctiveActions?.filter(a => a?.status === 'Completed')?.length} / {capaData?.correctiveActions?.length} completadas
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Acciones Preventivas</p>
                    <p className="font-medium text-foreground">
                      {capaData?.preventiveActions?.filter(a => a?.status === 'Completed')?.length} / {capaData?.preventiveActions?.length} completadas
                    </p>
                  </div>
                </div>
              </div>
              
              <Input
                label="Comentarios de Aprobación"
                type="textarea"
                placeholder="Ingrese comentarios finales sobre la efectividad del CAPA y la resolución de la desviación..."
                className="min-h-24 mb-4"
              />
              
              <div className="flex items-center gap-4">
                <Checkbox
                  label="Confirmo que todas las acciones han sido completadas satisfactoriamente"
                  required
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Icon name="GitBranch" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Flujo de Trabajo CAPA</h3>
          <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
            Paso {activeStep} de 4
          </div>
        </div>
      </div>
      {/* Workflow Steps */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          {workflowSteps?.map((step, index) => (
            <React.Fragment key={step?.id}>
              <button
                onClick={() => setActiveStep(step?.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeStep === step?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={step?.icon} size={16} />
                <span className="hidden sm:inline">{step?.title}</span>
              </button>
              
              {index < workflowSteps?.length - 1 && (
                <div className="flex-1 h-px bg-border mx-2" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Step Content */}
      <div className="p-6">
        {renderStepContent()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
            disabled={activeStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Anterior
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="secondary"
              iconName="Save"
              iconPosition="left"
            >
              Guardar Progreso
            </Button>
            
            {activeStep < 4 ? (
              <Button
                variant="default"
                onClick={() => setActiveStep(Math.min(4, activeStep + 1))}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Siguiente
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={() => onApproveCAPA(capaData)}
                iconName="Check"
                iconPosition="left"
              >
                Aprobar CAPA
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAPAWorkflow;