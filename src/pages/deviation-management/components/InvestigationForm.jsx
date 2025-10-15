import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvestigationForm = ({ deviation, onSave, onSubmit }) => {
  const [formData, setFormData] = useState({
    rootCauseAnalysis: deviation?.investigation?.rootCauseAnalysis || '',
    impactAssessment: deviation?.investigation?.impactAssessment || '',
    immediateActions: deviation?.investigation?.immediateActions || '',
    correctiveActions: deviation?.investigation?.correctiveActions || '',
    preventiveActions: deviation?.investigation?.preventiveActions || '',
    effectivenessVerification: deviation?.investigation?.effectivenessVerification || '',
    investigatorNotes: deviation?.investigation?.investigatorNotes || '',
    requiresCAPA: deviation?.investigation?.requiresCAPA || false,
    requiresRegulatory: deviation?.investigation?.requiresRegulatory || false,
    requiresCustomerNotification: deviation?.investigation?.requiresCustomerNotification || false
  });

  const [activeSection, setActiveSection] = useState('rootCause');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'rootCause', label: 'Análisis de Causa Raíz', icon: 'Search' },
    { id: 'impact', label: 'Evaluación de Impacto', icon: 'Target' },
    { id: 'actions', label: 'Acciones Correctivas/Preventivas', icon: 'CheckSquare' },
    { id: 'verification', label: 'Verificación de Efectividad', icon: 'Shield' }
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'rootCause':
        return (
          <div className="space-y-6">
            <Input
              label="Análisis de Causa Raíz"
              type="textarea"
              placeholder="Describa el análisis detallado de la causa raíz utilizando metodologías como 5 Por Qués, Diagrama de Ishikawa, etc."
              value={formData?.rootCauseAnalysis}
              onChange={(e) => handleInputChange('rootCauseAnalysis', e?.target?.value)}
              required
              className="min-h-32"
            />
            <Input
              label="Notas del Investigador"
              type="textarea"
              placeholder="Observaciones adicionales, evidencias encontradas, entrevistas realizadas..."
              value={formData?.investigatorNotes}
              onChange={(e) => handleInputChange('investigatorNotes', e?.target?.value)}
              className="min-h-24"
            />
          </div>
        );
        
      case 'impact':
        return (
          <div className="space-y-6">
            <Input
              label="Evaluación de Impacto"
              type="textarea"
              placeholder="Evalúe el impacto en la calidad del producto, seguridad del paciente, cumplimiento regulatorio y operaciones..."
              value={formData?.impactAssessment}
              onChange={(e) => handleInputChange('impactAssessment', e?.target?.value)}
              required
              className="min-h-32"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                label="Requiere CAPA"
                checked={formData?.requiresCAPA}
                onChange={(e) => handleInputChange('requiresCAPA', e?.target?.checked)}
              />
              <Checkbox
                label="Notificación Regulatoria"
                checked={formData?.requiresRegulatory}
                onChange={(e) => handleInputChange('requiresRegulatory', e?.target?.checked)}
              />
              <Checkbox
                label="Notificación al Cliente"
                checked={formData?.requiresCustomerNotification}
                onChange={(e) => handleInputChange('requiresCustomerNotification', e?.target?.checked)}
              />
            </div>
          </div>
        );
        
      case 'actions':
        return (
          <div className="space-y-6">
            <Input
              label="Acciones Inmediatas"
              type="textarea"
              placeholder="Describa las acciones inmediatas tomadas para contener la desviación..."
              value={formData?.immediateActions}
              onChange={(e) => handleInputChange('immediateActions', e?.target?.value)}
              required
              className="min-h-24"
            />
            <Input
              label="Acciones Correctivas"
              type="textarea"
              placeholder="Defina las acciones correctivas para abordar la causa raíz identificada..."
              value={formData?.correctiveActions}
              onChange={(e) => handleInputChange('correctiveActions', e?.target?.value)}
              required
              className="min-h-24"
            />
            <Input
              label="Acciones Preventivas"
              type="textarea"
              placeholder="Establezca acciones preventivas para evitar la recurrencia de desviaciones similares..."
              value={formData?.preventiveActions}
              onChange={(e) => handleInputChange('preventiveActions', e?.target?.value)}
              className="min-h-24"
            />
          </div>
        );
        
      case 'verification':
        return (
          <div className="space-y-6">
            <Input
              label="Verificación de Efectividad"
              type="textarea"
              placeholder="Describa cómo se verificará la efectividad de las acciones implementadas, incluyendo métricas y cronograma..."
              value={formData?.effectivenessVerification}
              onChange={(e) => handleInputChange('effectivenessVerification', e?.target?.value)}
              className="min-h-32"
            />
            <div className="bg-muted/50 border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Info" size={16} className="text-accent" />
                <h4 className="text-sm font-medium text-foreground">Requisitos de Verificación</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Definir métricas cuantificables para medir la efectividad</li>
                <li>• Establecer cronograma de seguimiento y revisión</li>
                <li>• Asignar responsables para la verificación</li>
                <li>• Documentar criterios de aceptación</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Section Navigation */}
      <div className="border-b border-border p-4">
        <div className="flex flex-wrap gap-2">
          {sections?.map((section) => (
            <button
              key={section?.id}
              onClick={() => setActiveSection(section?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeSection === section?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={section?.icon} size={16} />
              <span className="hidden sm:inline">{section?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Form Content */}
      <div className="p-6">
        {renderSectionContent()}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Guardar Borrador
          </Button>
          
          <Button
            variant="default"
            onClick={() => onSubmit(formData)}
            iconName="Send"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Enviar para Revisión
          </Button>
          
          <Button
            variant="secondary"
            iconName="FileText"
            iconPosition="left"
            className="flex-1 sm:flex-none"
          >
            Generar Reporte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InvestigationForm;