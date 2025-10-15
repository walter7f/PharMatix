import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkflowActions = ({ 
  batchData, 
  testCategories, 
  onSaveProgress, 
  onSubmitForReview, 
  onGenerateDeviation,
  isSaving = false 
}) => {
  const navigate = useNavigate();

  const calculateProgress = () => {
    const totalTests = testCategories?.reduce((sum, category) => sum + category?.tests?.length, 0);
    const completedTests = testCategories?.reduce((sum, category) => 
      sum + category?.tests?.filter(test => test?.measuredValue && test?.technician)?.length, 0
    );
    
    return totalTests > 0 ? Math.round((completedTests / totalTests) * 100) : 0;
  };

  const hasNonConformingResults = () => {
    return testCategories?.some(category =>
      category?.tests?.some(test => {
        if (!test?.measuredValue || !test?.specification) return false;
        
        const measured = parseFloat(test?.measuredValue);
        const spec = test?.specification;
        
        if (spec?.min !== undefined && spec?.max !== undefined) {
          return measured < spec?.min || measured > spec?.max;
        }
        
        if (spec?.target !== undefined) {
          const tolerance = spec?.tolerance || 0;
          return Math.abs(measured - spec?.target) > tolerance;
        }
        
        return false;
      })
    );
  };

  const allTestsCompleted = () => {
    return testCategories?.every(category =>
      category?.tests?.every(test => test?.measuredValue && test?.technician)
    );
  };

  const allCategoriesSigned = () => {
    return testCategories?.filter(category => category?.requiresSignature)?.every(category => category?.signedBy);
  };

  const canSubmitForReview = () => {
    return allTestsCompleted() && allCategoriesSigned();
  };

  const progress = calculateProgress();
  const hasNonConforming = hasNonConformingResults();
  const canSubmit = canSubmitForReview();

  const handleNavigateToAuditTrail = () => {
    // Navigate to audit trail with batch context
    navigate('/main-dashboard', { 
      state: { 
        highlightAuditTrail: true, 
        batchNumber: batchData?.batchNumber 
      } 
    });
  };

  const handleNavigateToDeviation = () => {
    navigate('/deviation-management', {
      state: {
        createNew: true,
        batchNumber: batchData?.batchNumber,
        source: 'quality-control'
      }
    });
  };

  const handleNavigateToBatchRecord = () => {
    navigate('/batch-record-management', {
      state: {
        batchNumber: batchData?.batchNumber,
        fromQualityControl: true
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Workflow" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Acciones de Flujo de Trabajo</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">Progreso:</div>
          <div className="flex items-center space-x-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  progress === 100 ? 'bg-success' : progress >= 75 ? 'bg-primary' : 'bg-warning'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-foreground">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg border ${
          allTestsCompleted() ? 'bg-success/10 border-success/20' : 'bg-muted/30 border-border'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name={allTestsCompleted() ? "CheckCircle" : "Clock"} 
              size={16} 
              className={allTestsCompleted() ? 'text-success' : 'text-muted-foreground'} 
            />
            <span className="text-sm font-medium text-foreground">Pruebas Completadas</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {allTestsCompleted() ? 'Todas las pruebas han sido completadas' : 'Pruebas pendientes de completar'}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${
          allCategoriesSigned() ? 'bg-success/10 border-success/20' : 'bg-muted/30 border-border'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name={allCategoriesSigned() ? "PenTool" : "AlertCircle"} 
              size={16} 
              className={allCategoriesSigned() ? 'text-success' : 'text-muted-foreground'} 
            />
            <span className="text-sm font-medium text-foreground">Firmas Electrónicas</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {allCategoriesSigned() ? 'Todas las categorías firmadas' : 'Firmas pendientes'}
          </p>
        </div>

        <div className={`p-4 rounded-lg border ${
          hasNonConforming ? 'bg-error/10 border-error/20' : 'bg-success/10 border-success/20'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <Icon 
              name={hasNonConforming ? "AlertTriangle" : "ShieldCheck"} 
              size={16} 
              className={hasNonConforming ? 'text-error' : 'text-success'} 
            />
            <span className="text-sm font-medium text-foreground">Estado de Conformidad</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {hasNonConforming ? 'Resultados no conformes detectados' : 'Todos los resultados conformes'}
          </p>
        </div>
      </div>

      {/* Non-conforming Alert */}
      {hasNonConforming && (
        <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-error mb-1">Resultados No Conformes Detectados</p>
              <p className="text-xs text-error/80 mb-3">
                Se han encontrado resultados que no cumplen con las especificaciones. 
                Es necesario generar una desviación para investigar y documentar las acciones correctivas.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={onGenerateDeviation}
                iconName="AlertTriangle"
                iconPosition="left"
                className="border-error text-error hover:bg-error/10"
              >
                Generar Desviación
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Actions */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Button
          variant="outline"
          onClick={onSaveProgress}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
          className="flex-1"
        >
          Guardar Progreso
        </Button>

        <Button
          variant="default"
          onClick={onSubmitForReview}
          disabled={!canSubmit}
          iconName="Send"
          iconPosition="left"
          className="flex-1"
        >
          Enviar para Revisión
        </Button>
      </div>

      {/* Navigation Actions */}
      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground mb-3">Navegación Relacionada</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToAuditTrail}
            iconName="FileSearch"
            iconPosition="left"
            className="justify-start"
          >
            Ver Auditoría
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToDeviation}
            iconName="AlertTriangle"
            iconPosition="left"
            className="justify-start"
          >
            Gestión de Desviaciones
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNavigateToBatchRecord}
            iconName="FileText"
            iconPosition="left"
            className="justify-start"
          >
            Registro de Lote
          </Button>
        </div>
      </div>

      {/* Submission Requirements */}
      {!canSubmit && (
        <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={14} className="text-accent flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium text-foreground mb-1">Requisitos para Envío</p>
              <ul className="text-muted-foreground space-y-1">
                {!allTestsCompleted() && <li>• Completar todas las pruebas pendientes</li>}
                {!allCategoriesSigned() && <li>• Firmar electrónicamente todas las categorías</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowActions;