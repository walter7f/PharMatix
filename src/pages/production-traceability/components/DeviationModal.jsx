import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const DeviationModal = ({ isOpen, onClose, deviation, onUpdateDeviation }) => {
  const [deviationData, setDeviationData] = useState({
    id: deviation?.id || '',
    title: deviation?.title || '',
    description: deviation?.description || '',
    severity: deviation?.severity || 'medium',
    category: deviation?.category || '',
    rootCause: deviation?.rootCause || '',
    correctiveActions: deviation?.correctiveActions || '',
    preventiveActions: deviation?.preventiveActions || '',
    assignedTo: deviation?.assignedTo || '',
    dueDate: deviation?.dueDate || '',
    status: deviation?.status || 'open',
    requiresValidation: deviation?.requiresValidation || false
  });

  if (!isOpen) return null;

  const severityOptions = [
    { value: 'low', label: 'Baja - Sin impacto en calidad' },
    { value: 'medium', label: 'Media - Impacto menor' },
    { value: 'high', label: 'Alta - Impacto significativo' },
    { value: 'critical', label: 'Crítica - Impacto mayor' }
  ];

  const categoryOptions = [
    { value: 'process', label: 'Proceso de Manufactura' },
    { value: 'equipment', label: 'Equipo y Maquinaria' },
    { value: 'material', label: 'Materiales y Componentes' },
    { value: 'environmental', label: 'Condiciones Ambientales' },
    { value: 'documentation', label: 'Documentación' },
    { value: 'personnel', label: 'Personal y Capacitación' }
  ];

  const statusOptions = [
    { value: 'open', label: 'Abierta - Pendiente de investigación' },
    { value: 'investigating', label: 'En Investigación' },
    { value: 'pending-approval', label: 'Pendiente de Aprobación' },
    { value: 'closed', label: 'Cerrada - Completada' }
  ];

  const assigneeOptions = [
    { value: 'dr.chen', label: 'Dr. Sarah Chen - Gerente de Calidad' },
    { value: 'eng.rodriguez', label: 'Ing. Carlos Rodríguez - Supervisor de Producción' },
    { value: 'tech.martinez', label: 'Téc. Ana Martínez - Especialista QC' },
    { value: 'mgr.lopez', label: 'Mgr. Luis López - Gerente de Planta' }
  ];

  const handleInputChange = (field, value) => {
    setDeviationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    onUpdateDeviation(deviationData);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'high':
        return 'text-error bg-error/10';
      case 'critical':
        return 'text-error bg-error/20 font-semibold';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Gestión de Desviación</h2>
            <p className="text-sm text-muted-foreground mt-1">
              ID: {deviationData?.id || 'DEV-2024-' + Math.floor(Math.random() * 1000)?.toString()?.padStart(3, '0')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Título de la Desviación"
                type="text"
                placeholder="Descripción breve del problema..."
                value={deviationData?.title}
                onChange={(e) => handleInputChange('title', e?.target?.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Descripción Detallada
                </label>
                <textarea
                  className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Describa detalladamente la desviación observada..."
                  value={deviationData?.description}
                  onChange={(e) => handleInputChange('description', e?.target?.value)}
                  required
                />
              </div>

              <Select
                label="Severidad"
                options={severityOptions}
                value={deviationData?.severity}
                onChange={(value) => handleInputChange('severity', value)}
                required
              />

              <Select
                label="Categoría"
                options={categoryOptions}
                value={deviationData?.category}
                onChange={(value) => handleInputChange('category', value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Análisis de Causa Raíz
                </label>
                <textarea
                  className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Identifique la causa raíz del problema..."
                  value={deviationData?.rootCause}
                  onChange={(e) => handleInputChange('rootCause', e?.target?.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Acciones Correctivas
                </label>
                <textarea
                  className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Describa las acciones correctivas inmediatas..."
                  value={deviationData?.correctiveActions}
                  onChange={(e) => handleInputChange('correctiveActions', e?.target?.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Acciones Preventivas
                </label>
                <textarea
                  className="w-full min-h-24 px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-vertical"
                  placeholder="Describa las acciones preventivas a largo plazo..."
                  value={deviationData?.preventiveActions}
                  onChange={(e) => handleInputChange('preventiveActions', e?.target?.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Asignado a"
              options={assigneeOptions}
              value={deviationData?.assignedTo}
              onChange={(value) => handleInputChange('assignedTo', value)}
              placeholder="Seleccionar responsable..."
            />

            <Input
              label="Fecha Límite"
              type="date"
              value={deviationData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
            />

            <Select
              label="Estado"
              options={statusOptions}
              value={deviationData?.status}
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={deviationData?.requiresValidation}
              onChange={(e) => handleInputChange('requiresValidation', e?.target?.checked)}
            />
            <label className="text-sm text-foreground">
              Requiere validación adicional del departamento de calidad
            </label>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <span className="text-sm font-medium text-foreground">Impacto y Clasificación</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getSeverityColor(deviationData?.severity)}`}>
              Severidad: {severityOptions?.find(opt => opt?.value === deviationData?.severity)?.label}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="Save"
            >
              Guardar Desviación
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviationModal;