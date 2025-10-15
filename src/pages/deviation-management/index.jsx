import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import DeviationHeader from './components/DeviationHeader';
import InvestigationForm from './components/InvestigationForm';
import EvidenceCollection from './components/EvidenceCollection';
import RelatedDeviations from './components/RelatedDeviations';
import CAPAWorkflow from './components/CAPAWorkflow';

const DeviationManagement = () => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState('es');
  const [activeTab, setActiveTab] = useState('investigation');
  const [isLoading, setIsLoading] = useState(false);

  // Mock deviation data
  const [deviation] = useState({
    id: 'DEV-2025-001',
    title: 'Desviación en Temperatura de Proceso - Línea de Producción 3',
    severity: 'Major',
    status: 'Under Investigation',
    detectionDate: '2025-01-12',
    dueDate: '2025-01-19',
    assignedTo: 'Dr. Sarah Chen',
    affectedBatches: ['LOT-2025-010', 'LOT-2025-011'],
    riskLevel: 'Alto',
    escalated: true,
    description: `Durante el proceso de granulación del lote LOT-2025-010, se detectó una desviación en la temperatura del equipo granulador. La temperatura registrada fue de 85°C cuando el rango especificado es de 75-80°C. Esta desviación se mantuvo por aproximadamente 15 minutos antes de ser detectada por el operador.`,
    investigation: {
      rootCauseAnalysis: '',
      impactAssessment: '',
      immediateActions: 'Se detuvo inmediatamente el proceso y se aisló el lote afectado.',
      correctiveActions: '',
      preventiveActions: '',
      effectivenessVerification: '',
      investigatorNotes: '',
      requiresCAPA: true,
      requiresRegulatory: false,
      requiresCustomerNotification: false
    }
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const handleSaveInvestigation = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Investigation saved:', formData);
      // Show success message
    } catch (error) {
      console.error('Error saving investigation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitInvestigation = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Investigation submitted for review:', formData);
      // Show success message and potentially redirect
    } catch (error) {
      console.error('Error submitting investigation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvidence = (evidence) => {
    console.log('Adding evidence:', evidence);
    // Handle evidence addition
  };

  const handleRemoveEvidence = (evidenceId) => {
    console.log('Removing evidence:', evidenceId);
    // Handle evidence removal
  };

  const handleViewRelatedDeviation = (deviationId) => {
    console.log('Viewing related deviation:', deviationId);
    // Navigate to related deviation or open in modal
  };

  const handleUpdateCAPA = (capaData) => {
    console.log('Updating CAPA:', capaData);
    // Handle CAPA update
  };

  const handleApproveCAPA = (capaData) => {
    console.log('Approving CAPA:', capaData);
    // Handle CAPA approval
  };

  const tabs = [
    { id: 'investigation', label: 'Investigación', icon: 'Search' },
    { id: 'evidence', label: 'Evidencias', icon: 'Paperclip' },
    { id: 'capa', label: 'CAPA', icon: 'GitBranch' },
    { id: 'related', label: 'Relacionadas', icon: 'Link' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'investigation':
        return (
          <InvestigationForm
            deviation={deviation}
            onSave={handleSaveInvestigation}
            onSubmit={handleSubmitInvestigation}
          />
        );
      case 'evidence':
        return (
          <EvidenceCollection
            deviation={deviation}
            onAddEvidence={handleAddEvidence}
            onRemoveEvidence={handleRemoveEvidence}
          />
        );
      case 'capa':
        return (
          <CAPAWorkflow
            deviation={deviation}
            onUpdateCAPA={handleUpdateCAPA}
            onApproveCAPA={handleApproveCAPA}
          />
        );
      case 'related':
        return (
          <RelatedDeviations
            currentDeviationId={deviation?.id}
            onViewDeviation={handleViewRelatedDeviation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Gestión de Desviaciones - PharmaTrace Pro</title>
        <meta name="description" content="Sistema integral de gestión de desviaciones farmacéuticas con flujos de trabajo CAPA para cumplimiento regulatorio" />
      </Helmet>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <BreadcrumbTrail />
        
        {/* Deviation Header */}
        <DeviationHeader
          deviation={deviation}
          onStatusChange={(status) => console.log('Status changed:', status)}
          onPriorityChange={(priority) => console.log('Priority changed:', priority)}
        />

        {/* Tab Navigation */}
        <div className="bg-surface border border-border rounded-lg mb-6">
          <div className="border-b border-border">
            <nav className="flex space-x-1 p-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Primary Content */}
          <div className="xl:col-span-2">
            {renderTabContent()}
          </div>

          {/* Secondary Panel */}
          <div className="space-y-6">
            {activeTab !== 'related' && (
              <RelatedDeviations
                currentDeviationId={deviation?.id}
                onViewDeviation={handleViewRelatedDeviation}
              />
            )}
            
            {/* Quick Actions */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Acciones Rápidas</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/batch-record-management')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <span>Ver Registros de Lote</span>
                </button>
                <button
                  onClick={() => navigate('/quality-control-validation')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <span>Control de Calidad</span>
                </button>
                <button
                  onClick={() => navigate('/production-traceability')}
                  className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
                >
                  <span>Trazabilidad de Producción</span>
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-4">Cronología de Eventos</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">12/01/2025 14:30</p>
                    <p className="text-sm text-foreground">Desviación detectada</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">12/01/2025 14:45</p>
                    <p className="text-sm text-foreground">Proceso detenido</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">12/01/2025 15:00</p>
                    <p className="text-sm text-foreground">Investigación iniciada</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pendiente</p>
                    <p className="text-sm text-foreground">Revisión de gerencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviationManagement;