import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BatchSelector from './components/BatchSelector';
import FilterControls from './components/FilterControls';
import BatchTimelineCard from './components/BatchTimelineCard';
import RealTimePanel from './components/RealTimePanel';
import SignatureModal from './components/SignatureModal';
import DeviationModal from './components/DeviationModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProductionTraceability = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('LOT-2024-001');
  const [expandedSteps, setExpandedSteps] = useState(new Set(['step-1']));
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [showDeviationModal, setShowDeviationModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);
  const [selectedDeviation, setSelectedDeviation] = useState(null);
  const [filters, setFilters] = useState({});

  const [batchData, setBatchData] = useState({
    batchNumber: 'LOT-2024-001',
    productName: 'Paracetamol 500mg',
    productionLine: 'Línea A - Sólidos',
    startDate: '2024-09-14',
    plannedEndDate: '2024-09-16',
    status: 'in-progress',
    steps: [
      {
        id: 'step-1',
        name: 'Pesado de Materias Primas',
        description: 'Pesado y verificación de principios activos y excipientes',
        status: 'completed',
        startTime: '08:00',
        endTime: '09:30',
        operator: 'Téc. María González',
        requiresSignature: true,
        signed: true,
        parameters: [
          { name: 'Peso Principio Activo', value: 125.4, unit: 'kg', inSpec: true },
          { name: 'Peso Excipiente A', value: 45.2, unit: 'kg', inSpec: true },
          { name: 'Peso Excipiente B', value: 12.8, unit: 'kg', inSpec: true }
        ],
        materials: [
          { name: 'Paracetamol', quantity: 125.4, unit: 'kg' },
          { name: 'Lactosa', quantity: 45.2, unit: 'kg' },
          { name: 'Almidón', quantity: 12.8, unit: 'kg' }
        ],
        qualityChecks: [
          { name: 'Verificación de identidad', passed: true },
          { name: 'Control de peso', passed: true },
          { name: 'Inspección visual', passed: true }
        ],
        notes: 'Todos los materiales verificados según especificaciones. Sin observaciones.',
        attachments: [
          { name: 'Certificado_Paracetamol.pdf' },
          { name: 'Registro_Pesado.xlsx' }
        ]
      },
      {
        id: 'step-2',
        name: 'Mezclado',
        description: 'Mezclado homogéneo de todos los componentes',
        status: 'in-progress',
        startTime: '09:45',
        endTime: null,
        operator: 'Téc. Carlos Ruiz',
        requiresSignature: true,
        signed: false,
        parameters: [
          { name: 'Velocidad de mezclado', value: 150, unit: 'rpm', inSpec: true },
          { name: 'Tiempo de mezclado', value: 25, unit: 'min', inSpec: true },
          { name: 'Temperatura', value: 25.4, unit: '°C', inSpec: true }
        ],
        materials: [
          { name: 'Mezcla total', quantity: 183.4, unit: 'kg' }
        ],
        qualityChecks: [
          { name: 'Homogeneidad visual', passed: true },
          { name: 'Análisis de contenido', passed: false }
        ],
        notes: 'Mezclado en progreso. Pendiente análisis final de homogeneidad.',
        attachments: []
      },
      {
        id: 'step-3',
        name: 'Granulación',
        description: 'Proceso de granulación húmeda para mejorar compresibilidad',
        status: 'pending',
        startTime: null,
        endTime: null,
        operator: 'Téc. Ana López',
        requiresSignature: true,
        signed: false,
        parameters: [
          { name: 'Velocidad impelente', value: 0, unit: 'rpm', inSpec: true },
          { name: 'Velocidad chopper', value: 0, unit: 'rpm', inSpec: true },
          { name: 'Cantidad de agua', value: 0, unit: 'L', inSpec: true }
        ],
        materials: [],
        qualityChecks: [],
        notes: 'Pendiente de inicio una vez completado el mezclado.',
        attachments: []
      },
      {
        id: 'step-4',
        name: 'Secado',
        description: 'Secado del granulado hasta humedad especificada',
        status: 'deviation',
        startTime: '14:00',
        endTime: '16:30',
        operator: 'Téc. Luis Morales',
        requiresSignature: true,
        signed: false,
        parameters: [
          { name: 'Temperatura entrada', value: 85, unit: '°C', inSpec: false },
          { name: 'Temperatura salida', value: 45, unit: '°C', inSpec: true },
          { name: 'Humedad final', value: 3.2, unit: '%', inSpec: false }
        ],
        materials: [
          { name: 'Granulado húmedo', quantity: 180.1, unit: 'kg' }
        ],
        qualityChecks: [
          { name: 'Control de humedad', passed: false },
          { name: 'Análisis granulométrico', passed: true }
        ],
        notes: 'Desviación detectada en temperatura de entrada y humedad final.',
        attachments: [
          { name: 'Reporte_Desviacion_SEC001.pdf' }
        ]
      }
    ]
  });

  useEffect(() => {
    document.title = 'Trazabilidad de Producción - PharmaTrace Pro';
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleBatchChange = (batchNumber) => {
    setSelectedBatch(batchNumber);
    // In a real app, this would fetch batch data from API
    console.log('Loading batch data for:', batchNumber);
  };

  const handleNewBatch = () => {
    navigate('/batch-record-management');
  };

  const handleStepToggle = (stepId) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded?.has(stepId)) {
      newExpanded?.delete(stepId);
    } else {
      newExpanded?.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const handleSignature = (stepId) => {
    const step = batchData?.steps?.find(s => s?.id === stepId);
    setSelectedStep(step);
    setShowSignatureModal(true);
  };

  const handleSignatureConfirm = (signatureData) => {
    setBatchData(prev => ({
      ...prev,
      steps: prev?.steps?.map(step =>
        step?.id === selectedStep?.id
          ? { ...step, signed: true, signatureData }
          : step
      )
    }));
    setShowSignatureModal(false);
    setSelectedStep(null);
  };

  const handleDeviation = (stepId) => {
    const step = batchData?.steps?.find(s => s?.id === stepId);
    setSelectedDeviation({
      id: 'DEV-2024-001',
      title: `Desviación en ${step?.name}`,
      description: 'Parámetros fuera de especificación detectados durante el proceso',
      severity: 'high',
      category: 'process',
      rootCause: 'Mal funcionamiento del sensor de temperatura',
      correctiveActions: 'Calibración del equipo y reproceso del lote',
      preventiveActions: 'Implementar mantenimiento preventivo mensual',
      assignedTo: 'dr.chen',
      dueDate: '2024-09-20',
      status: 'investigating',
      requiresValidation: true
    });
    setShowDeviationModal(true);
  };

  const handleDeviationUpdate = (deviationData) => {
    console.log('Deviation updated:', deviationData);
    setShowDeviationModal(false);
    setSelectedDeviation(null);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters applied:', newFilters);
  };

  const handleExport = () => {
    console.log('Exporting batch data...');
    // In a real app, this would generate and download a report
  };

  const handleFilterReset = () => {
    setFilters({});
    console.log('Filters reset');
  };

  const getOverallStatus = () => {
    const hasDeviation = batchData?.steps?.some(step => step?.status === 'deviation');
    const hasInProgress = batchData?.steps?.some(step => step?.status === 'in-progress');
    const allCompleted = batchData?.steps?.every(step => step?.status === 'completed');

    if (hasDeviation) return { status: 'deviation', label: 'Con Desviación', color: 'text-error' };
    if (hasInProgress) return { status: 'in-progress', label: 'En Progreso', color: 'text-warning' };
    if (allCompleted) return { status: 'completed', label: 'Completado', color: 'text-success' };
    return { status: 'pending', label: 'Pendiente', color: 'text-muted-foreground' };
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={handleMobileMenuToggle} isMenuOpen={isMobileMenuOpen} />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        </div>
        
        <main className={`flex-1 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        } pt-16`}>
          <div className="p-6">
            <BreadcrumbTrail />
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">Trazabilidad de Producción</h1>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full bg-muted/50 ${overallStatus?.color}`}>
                    <Icon name="Activity" size={16} />
                    <span className="text-sm font-medium">{overallStatus?.label}</span>
                  </div>
                  <Button
                    variant="outline"
                    iconName="BarChart3"
                    onClick={() => navigate('/quality-control-validation')}
                  >
                    Control de Calidad
                  </Button>
                </div>
              </div>
              <p className="text-muted-foreground">
                Monitoreo en tiempo real y seguimiento completo de lotes para cumplimiento farmacéutico
              </p>
            </div>

            <BatchSelector
              selectedBatch={selectedBatch}
              onBatchChange={handleBatchChange}
              onNewBatch={handleNewBatch}
            />

            <FilterControls
              onFilterChange={handleFilterChange}
              onExport={handleExport}
              onReset={handleFilterReset}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Cronología del Lote: {batchData?.batchNumber}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {batchData?.productName} - {batchData?.productionLine}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="FileText"
                        onClick={() => navigate('/batch-record-management')}
                      >
                        Ver Registro
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="AlertTriangle"
                        onClick={() => navigate('/deviation-management')}
                      >
                        Desviaciones
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {batchData?.steps?.map((step) => (
                      <BatchTimelineCard
                        key={step?.id}
                        step={step}
                        isExpanded={expandedSteps?.has(step?.id)}
                        onToggle={handleStepToggle}
                        onSignature={handleSignature}
                        onDeviation={handleDeviation}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="xl:col-span-1">
                <RealTimePanel selectedBatch={selectedBatch} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <SignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onConfirm={handleSignatureConfirm}
        stepName={selectedStep?.name}
      />
      <DeviationModal
        isOpen={showDeviationModal}
        onClose={() => setShowDeviationModal(false)}
        deviation={selectedDeviation}
        onUpdateDeviation={handleDeviationUpdate}
      />
    </div>
  );
};

export default ProductionTraceability;