import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BatchInfoHeader from './components/BatchInfoHeader';
import TestCategorySection from './components/TestCategorySection';
import HistoricalDataPanel from './components/HistoricalDataPanel';
import DocumentAttachment from './components/DocumentAttachment';
import WorkflowActions from './components/WorkflowActions';

const QualityControlValidation = () => {
  const location = useLocation();
  const [expandedCategories, setExpandedCategories] = useState({
    physical: true,
    chemical: false,
    microbiological: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [attachments, setAttachments] = useState([]);

  // Mock batch data
  const [batchData] = useState({
    batchNumber: "LT-2024-0892",
    productName: "Paracetamol 500mg Comprimidos",
    productionLot: "PR-240914-001",
    manufacturingDate: "14/09/2024",
    expiryDate: "14/09/2027",
    quantity: "50,000 unidades",
    status: "In Progress",
    qualityManager: "Dr. María González",
    lastUpdated: "14/09/2024 16:30",
    deviationCount: 1
  });

  // Mock test categories with comprehensive test data
  const [testCategories, setTestCategories] = useState([
    {
      id: 'physical',
      name: 'Pruebas Físicas',
      type: 'physical',
      requiresSignature: true,
      signedBy: null,
      signedAt: null,
      tests: [
        {
          id: 'ph_001',
          parameter: 'pH',
          method: 'USP <791>',
          specification: { min: 6.8, max: 7.2, display: '6.8 - 7.2' },
          measuredValue: '7.0',
          technician: 'Ana Martínez',
          testDate: '2024-09-14T14:30',
          notes: 'Medición realizada a temperatura ambiente'
        },
        {
          id: 'moisture_001',
          parameter: 'Humedad',
          method: 'Karl Fischer',
          specification: { max: 2.0, display: '≤ 2.0%' },
          measuredValue: '1.2',
          technician: 'Carlos López',
          testDate: '2024-09-14T15:15',
          notes: ''
        },
        {
          id: 'hardness_001',
          parameter: 'Dureza',
          method: 'USP <1217>',
          specification: { min: 80, max: 120, display: '80 - 120 N' },
          measuredValue: '',
          technician: '',
          testDate: '',
          notes: ''
        }
      ]
    },
    {
      id: 'chemical',
      name: 'Pruebas Químicas',
      type: 'chemical',
      requiresSignature: true,
      signedBy: null,
      signedAt: null,
      tests: [
        {
          id: 'assay_001',
          parameter: 'Valoración (Paracetamol)',
          method: 'HPLC USP <621>',
          specification: { min: 95.0, max: 105.0, display: '95.0 - 105.0%' },
          measuredValue: '98.5',
          technician: 'Dr. Elena Ruiz',
          testDate: '2024-09-14T13:45',
          notes: 'Análisis por HPLC validado'
        },
        {
          id: 'dissolution_001',
          parameter: 'Disolución',
          method: 'USP <711>',
          specification: { min: 80, display: '≥ 80% en 30 min' },
          measuredValue: '85.2',
          technician: 'Miguel Santos',
          testDate: '2024-09-14T16:00',
          notes: 'Medio: HCl 0.1N, 37°C, 50 rpm'
        },
        {
          id: 'impurities_001',
          parameter: 'Impurezas Relacionadas',
          method: 'HPLC USP <621>',
          specification: { max: 0.5, display: '≤ 0.5%' },
          measuredValue: '',
          technician: '',
          testDate: '',
          notes: ''
        }
      ]
    },
    {
      id: 'microbiological',
      name: 'Pruebas Microbiológicas',
      type: 'microbiological',
      requiresSignature: true,
      signedBy: null,
      signedAt: null,
      tests: [
        {
          id: 'micro_001',
          parameter: 'Recuento Total de Aerobios',
          method: 'USP <61>',
          specification: { max: 1000, display: '≤ 1000 UFC/g' },
          measuredValue: '',
          technician: '',
          testDate: '',
          notes: ''
        },
        {
          id: 'micro_002',
          parameter: 'Levaduras y Mohos',
          method: 'USP <61>',
          specification: { max: 100, display: '≤ 100 UFC/g' },
          measuredValue: '',
          technician: '',
          testDate: '',
          notes: ''
        }
      ]
    }
  ]);

  // Mock historical data for trends and comparison
  const historicalData = [
    { batchNumber: 'LT-2024-0885', testsCompleted: 8, deviations: 0, passRate: 100 },
    { batchNumber: 'LT-2024-0886', testsCompleted: 8, deviations: 1, passRate: 87.5 },
    { batchNumber: 'LT-2024-0887', testsCompleted: 8, deviations: 0, passRate: 100 },
    { batchNumber: 'LT-2024-0888', testsCompleted: 8, deviations: 0, passRate: 100 },
    { batchNumber: 'LT-2024-0889', testsCompleted: 8, deviations: 2, passRate: 75 },
    { batchNumber: 'LT-2024-0890', testsCompleted: 8, deviations: 0, passRate: 100 },
    { batchNumber: 'LT-2024-0891', testsCompleted: 8, deviations: 1, passRate: 87.5 }
  ];

  const trendData = [
    { batchNumber: 'LT-885', parameter: 'pH', value: 6.9 },
    { batchNumber: 'LT-886', parameter: 'pH', value: 7.1 },
    { batchNumber: 'LT-887', parameter: 'pH', value: 7.0 },
    { batchNumber: 'LT-888', parameter: 'pH', value: 6.8 },
    { batchNumber: 'LT-889', parameter: 'pH', value: 7.2 },
    { batchNumber: 'LT-890', parameter: 'pH', value: 7.0 },
    { batchNumber: 'LT-891', parameter: 'pH', value: 6.9 },
    { batchNumber: 'LT-885', parameter: 'moisture', value: 1.1 },
    { batchNumber: 'LT-886', parameter: 'moisture', value: 1.3 },
    { batchNumber: 'LT-887', parameter: 'moisture', value: 1.0 },
    { batchNumber: 'LT-888', parameter: 'moisture', value: 1.2 },
    { batchNumber: 'LT-889', parameter: 'moisture', value: 1.4 },
    { batchNumber: 'LT-890', parameter: 'moisture', value: 1.1 },
    { batchNumber: 'LT-891', parameter: 'moisture', value: 1.2 },
    { batchNumber: 'LT-885', parameter: 'assay', value: 98.2 },
    { batchNumber: 'LT-886', parameter: 'assay', value: 99.1 },
    { batchNumber: 'LT-887', parameter: 'assay', value: 97.8 },
    { batchNumber: 'LT-888', parameter: 'assay', value: 98.5 },
    { batchNumber: 'LT-889', parameter: 'assay', value: 99.3 },
    { batchNumber: 'LT-890', parameter: 'assay', value: 98.0 },
    { batchNumber: 'LT-891', parameter: 'assay', value: 98.7 },
    { batchNumber: 'LT-885', parameter: 'dissolution', value: 87.2 },
    { batchNumber: 'LT-886', parameter: 'dissolution', value: 84.1 },
    { batchNumber: 'LT-887', parameter: 'dissolution', value: 89.8 },
    { batchNumber: 'LT-888', parameter: 'dissolution', value: 86.5 },
    { batchNumber: 'LT-889', parameter: 'dissolution', value: 83.3 },
    { batchNumber: 'LT-890', parameter: 'dissolution', value: 88.0 },
    { batchNumber: 'LT-891', parameter: 'dissolution', value: 85.7 }
  ];

  useEffect(() => {
    // Handle navigation state if coming from other pages
    if (location?.state?.batchNumber) {
      console.log('Loaded batch from navigation:', location?.state?.batchNumber);
    }
  }, [location?.state]);

  const handleCategoryToggle = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev?.[categoryId]
    }));
  };

  const handleTestUpdate = (categoryId, updatedTests) => {
    setTestCategories(prev => prev?.map(category =>
      category?.id === categoryId
        ? { ...category, tests: updatedTests }
        : category
    ));
  };

  const handleSignature = (categoryId, signedBy, signedAt) => {
    setTestCategories(prev => prev?.map(category =>
      category?.id === categoryId
        ? { ...category, signedBy, signedAt }
        : category
    ));
  };

  const handleSaveProgress = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Progress saved successfully');
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      console.log('Submitting batch for review:', batchData?.batchNumber);
      // Simulate API call for submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Lote enviado para revisión exitosamente');
    } catch (error) {
      console.error('Error submitting for review:', error);
    }
  };

  const handleGenerateDeviation = () => {
    console.log('Generating deviation for batch:', batchData?.batchNumber);
    // This would typically navigate to deviation management
  };

  const handleViewBatchDetails = () => {
    console.log('Viewing detailed batch information');
  };

  const handleAttachmentAdd = (attachment) => {
    setAttachments(prev => [...prev, attachment]);
  };

  const handleAttachmentRemove = (attachmentId) => {
    setAttachments(prev => prev?.filter(att => att?.id !== attachmentId));
  };

  const handleAttachmentView = (attachment) => {
    console.log('Viewing attachment:', attachment?.name);
    // This would typically open a document viewer
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <BreadcrumbTrail />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Control de Calidad y Validación</h1>
          <p className="text-muted-foreground">
            Registro y validación de resultados de pruebas para cumplimiento regulatorio
          </p>
        </div>

        <div className="space-y-6">
          {/* Batch Information Header */}
          <BatchInfoHeader 
            batchData={batchData}
            onViewDetails={handleViewBatchDetails}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content - Test Categories */}
            <div className="xl:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Categorías de Pruebas</h2>
                  <div className="text-sm text-muted-foreground">
                    {testCategories?.filter(cat => cat?.signedBy)?.length} de {testCategories?.length} categorías firmadas
                  </div>
                </div>

                <div className="space-y-4">
                  {testCategories?.map((category) => (
                    <TestCategorySection
                      key={category?.id}
                      category={category}
                      tests={category?.tests}
                      onTestUpdate={handleTestUpdate}
                      onSignature={handleSignature}
                      isExpanded={expandedCategories?.[category?.id]}
                      onToggle={() => handleCategoryToggle(category?.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Document Attachments */}
              <DocumentAttachment
                attachments={attachments}
                onAttachmentAdd={handleAttachmentAdd}
                onAttachmentRemove={handleAttachmentRemove}
                onAttachmentView={handleAttachmentView}
              />
            </div>

            {/* Sidebar - Historical Data and Actions */}
            <div className="space-y-6">
              <HistoricalDataPanel
                batchNumber={batchData?.batchNumber}
                historicalData={historicalData}
                trendData={trendData}
              />

              <WorkflowActions
                batchData={batchData}
                testCategories={testCategories}
                onSaveProgress={handleSaveProgress}
                onSubmitForReview={handleSubmitForReview}
                onGenerateDeviation={handleGenerateDeviation}
                isSaving={isSaving}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityControlValidation;