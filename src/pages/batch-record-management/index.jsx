import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import BatchHeader from './components/BatchHeader';
import ManufacturingSteps from './components/ManufacturingSteps';
import MaterialTraceability from './components/MaterialTraceability';
import EnvironmentalMonitoring from './components/EnvironmentalMonitoring';
import DocumentManagement from './components/DocumentManagement';
import Icon from '../../components/AppIcon';

const BatchRecordManagement = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('manufacturing');

  // Mock batch data
  const [batchData] = useState({
    batchNumber: "BT-2024-001234",
    productName: "Paracetamol 500mg Tabletas",
    plannedQuantity: "100,000 unidades",
    startDate: "14/09/2024",
    targetDate: "21/09/2024",
    supervisor: "Dr. María González",
    status: "in-progress",
    signaturesRequired: 8,
    signaturesCompleted: 5,
    manufacturingSteps: [
      {
        id: 1,
        stepNumber: 1,
        title: "Preparación de Materias Primas",
        description: "Pesado y verificación de materias primas según especificaciones",
        status: "completed",
        estimatedDuration: "2 horas",
        operator: "Juan Pérez",
        completedAt: "14/09/2024 08:30",
        parameters: [
          {
            id: 1,
            name: "Peso Paracetamol",
            actualValue: 50.2,
            unit: "kg",
            lowerLimit: 49.8,
            upperLimit: 50.2,
            withinLimits: true
          },
          {
            id: 2,
            name: "Humedad Relativa",
            actualValue: 45,
            unit: "%",
            lowerLimit: 40,
            upperLimit: 60,
            withinLimits: true
          }
        ],
        materials: [
          {
            id: 1,
            name: "Paracetamol USP",
            batchNumber: "PAR-2024-0156",
            quantity: 50.2,
            unit: "kg",
            verified: true
          },
          {
            id: 2,
            name: "Almidón de Maíz",
            batchNumber: "ALM-2024-0089",
            quantity: 5.1,
            unit: "kg",
            verified: true
          }
        ],
        qualityCheckpoints: [
          {
            id: 1,
            name: "Verificación de Identidad",
            description: "Confirmación de identidad por FTIR",
            result: "Cumple",
            passed: true,
            checkedBy: "Ana López"
          }
        ],
        signatures: [
          {
            id: 1,
            role: "Operador de Producción",
            signedBy: "Juan Pérez",
            timestamp: "14/09/2024 08:30"
          },
          {
            id: 2,
            role: "Supervisor de Calidad",
            signedBy: "Dr. Sarah Chen",
            timestamp: "14/09/2024 08:45"
          }
        ]
      },
      {
        id: 2,
        stepNumber: 2,
        title: "Mezclado y Granulación",
        description: "Proceso de mezclado húmedo y granulación en mezclador de alta cizalla",
        status: "requires-signature",
        estimatedDuration: "3 horas",
        operator: "Carlos Ruiz",
        parameters: [
          {
            id: 3,
            name: "Tiempo de Mezclado",
            actualValue: 15,
            unit: "min",
            lowerLimit: 12,
            upperLimit: 18,
            withinLimits: true
          },
          {
            id: 4,
            name: "Velocidad del Impeller",
            actualValue: 250,
            unit: "rpm",
            lowerLimit: 200,
            upperLimit: 300,
            withinLimits: true
          }
        ],
        materials: [
          {
            id: 3,
            name: "Solución Aglutinante PVP",
            batchNumber: "PVP-2024-0034",
            quantity: 2.5,
            unit: "L",
            verified: true
          }
        ],
        qualityCheckpoints: [
          {
            id: 2,
            name: "Distribución del Tamaño de Partícula",
            description: "Análisis granulométrico por tamizado",
            result: "Cumple",
            passed: true,
            checkedBy: "Luis Morales"
          }
        ]
      },
      {
        id: 3,
        stepNumber: 3,
        title: "Secado",
        description: "Secado en lecho fluido hasta humedad objetivo",
        status: "in-progress",
        estimatedDuration: "4 horas",
        operator: "Elena Vargas"
      },
      {
        id: 4,
        stepNumber: 4,
        title: "Compresión",
        description: "Compresión de tabletas en máquina rotativa",
        status: "pending",
        estimatedDuration: "6 horas"
      }
    ]
  });

  const [materials] = useState([
    {
      id: 1,
      name: "Paracetamol USP",
      materialCode: "API-001",
      specification: "USP 42",
      grade: "Farmacéutico",
      batchNumber: "PAR-2024-0156",
      supplier: "Farmachem Industries",
      countryOfOrigin: "India",
      manufacturingDate: "15/07/2024",
      expiryDate: "15/07/2026",
      daysToExpiry: 668,
      quantityUsed: 50.2,
      quantityAvailable: 500.0,
      unit: "kg",
      status: "verified",
      coaNumber: "COA-PAR-156-2024",
      qualityTests: [
        {
          id: 1,
          parameter: "Pureza",
          value: "99.8%",
          specification: "≥99.0%",
          result: "Cumple"
        },
        {
          id: 2,
          parameter: "Humedad",
          value: "0.3%",
          specification: "≤0.5%",
          result: "Cumple"
        }
      ],
      usageHistory: [
        {
          id: 1,
          batchNumber: "BT-2024-001233",
          date: "12/09/2024",
          quantity: 25.1,
          operator: "Juan Pérez"
        },
        {
          id: 2,
          batchNumber: "BT-2024-001234",
          date: "14/09/2024",
          quantity: 50.2,
          operator: "Juan Pérez"
        }
      ]
    },
    {
      id: 2,
      name: "Almidón de Maíz",
      materialCode: "EXC-002",
      specification: "NF 23",
      grade: "Farmacéutico",
      batchNumber: "ALM-2024-0089",
      supplier: "Excipientes Naturales SA",
      countryOfOrigin: "Argentina",
      manufacturingDate: "20/08/2024",
      expiryDate: "20/08/2026",
      daysToExpiry: 703,
      quantityUsed: 5.1,
      quantityAvailable: 100.0,
      unit: "kg",
      status: "verified",
      coaNumber: "COA-ALM-089-2024",
      qualityTests: [
        {
          id: 3,
          parameter: "pH",
          value: "6.2",
          specification: "5.0-7.0",
          result: "Cumple"
        }
      ],
      usageHistory: [
        {
          id: 3,
          batchNumber: "BT-2024-001234",
          date: "14/09/2024",
          quantity: 5.1,
          operator: "Juan Pérez"
        }
      ]
    },
    {
      id: 3,
      name: "Estearato de Magnesio",
      materialCode: "LUB-001",
      specification: "USP 42",
      grade: "Farmacéutico",
      batchNumber: "EST-2024-0067",
      supplier: "Lubricantes Farmacéuticos",
      countryOfOrigin: "España",
      manufacturingDate: "10/06/2024",
      expiryDate: "10/06/2025",
      daysToExpiry: 269,
      quantityUsed: 0.5,
      quantityAvailable: 25.0,
      unit: "kg",
      status: "pending",
      coaNumber: "COA-EST-067-2024",
      qualityTests: [
        {
          id: 4,
          parameter: "Pérdida por Secado",
          value: "4.8%",
          specification: "≤6.0%",
          result: "Cumple"
        }
      ],
      usageHistory: []
    }
  ]);

  const [environmentalData] = useState({
    temperature: [
      { timestamp: "08:00", value: 22.1, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "09:00", value: 22.3, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "10:00", value: 23.1, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "11:00", value: 23.8, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "12:00", value: 24.2, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "13:00", value: 24.8, status: "normal", upperLimit: 25, lowerLimit: 18 },
      { timestamp: "14:00", value: 25.2, status: "warning", upperLimit: 25, lowerLimit: 18 }
    ],
    humidity: [
      { timestamp: "08:00", value: 45.2, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "09:00", value: 46.1, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "10:00", value: 47.3, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "11:00", value: 48.1, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "12:00", value: 49.2, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "13:00", value: 50.8, status: "normal", upperLimit: 60, lowerLimit: 40 },
      { timestamp: "14:00", value: 52.1, status: "normal", upperLimit: 60, lowerLimit: 40 }
    ],
    pressure: [
      { timestamp: "08:00", value: 15.2, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "09:00", value: 15.8, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "10:00", value: 16.1, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "11:00", value: 16.3, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "12:00", value: 16.8, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "13:00", value: 17.2, status: "normal", upperLimit: 20, lowerLimit: 10 },
      { timestamp: "14:00", value: 17.5, status: "normal", upperLimit: 20, lowerLimit: 10 }
    ],
    airflow: [
      { timestamp: "08:00", value: 850, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "09:00", value: 865, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "10:00", value: 880, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "11:00", value: 895, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "12:00", value: 910, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "13:00", value: 925, status: "normal", upperLimit: 1000, lowerLimit: 800 },
      { timestamp: "14:00", value: 940, status: "normal", upperLimit: 1000, lowerLimit: 800 }
    ],
    alarms: [
      {
        id: 1,
        parameter: "Temperatura",
        message: "Temperatura excede límite superior",
        timestamp: "14/09/2024 14:05",
        sensorId: "TEMP-001",
        active: true
      }
    ],
    events: [
      {
        id: 1,
        type: "calibration",
        description: "Calibración de sensor de temperatura TEMP-001",
        timestamp: "14/09/2024 07:30",
        user: "Técnico Mantenimiento"
      },
      {
        id: 2,
        type: "maintenance",
        description: "Mantenimiento preventivo sistema HVAC",
        timestamp: "13/09/2024 18:00",
        user: "Equipo Mantenimiento"
      },
      {
        id: 3,
        type: "info",
        description: "Inicio de monitoreo para lote BT-2024-001234",
        timestamp: "14/09/2024 08:00",
        user: "Sistema Automático"
      }
    ]
  });

  const [documents] = useState([
    {
      id: 1,
      name: "Registro de Lote BT-2024-001234",
      description: "Registro completo de manufactura para lote de Paracetamol 500mg",
      category: "batch-records",
      type: "pdf",
      version: "1.2",
      status: "approved",
      lastModified: "14/09/2024 10:30",
      size: "2.4 MB",
      author: "Dr. María González"
    },
    {
      id: 2,
      name: "SOP-001 Preparación de Materias Primas",
      description: "Procedimiento operativo estándar para pesado y preparación de materias primas",
      category: "sop",
      type: "pdf",
      version: "3.1",
      status: "approved",
      lastModified: "10/09/2024 14:15",
      size: "1.8 MB",
      author: "Departamento de Calidad"
    },
    {
      id: 3,
      name: "Especificación Paracetamol 500mg",
      description: "Especificaciones técnicas y de calidad para tabletas de Paracetamol 500mg",
      category: "specifications",
      type: "pdf",
      version: "2.0",
      status: "approved",
      lastModified: "05/09/2024 09:20",
      size: "1.2 MB",
      author: "Dr. Luis Morales"
    },
    {
      id: 4,
      name: "Certificado de Análisis PAR-2024-0156",
      description: "COA para lote de Paracetamol USP utilizado en producción",
      category: "certificates",
      type: "pdf",
      version: "1.0",
      status: "approved",
      lastModified: "20/07/2024 16:45",
      size: "856 KB",
      author: "Farmachem Industries"
    },
    {
      id: 5,
      name: "Desviación DEV-2024-0089",
      description: "Reporte de desviación menor en proceso de granulación",
      category: "deviations",
      type: "pdf",
      version: "1.1",
      status: "pending",
      lastModified: "14/09/2024 11:20",
      size: "1.1 MB",
      author: "Carlos Ruiz"
    },
    {
      id: 6,
      name: "SOP-015 Limpieza de Equipos",
      description: "Procedimiento para limpieza y sanitización de equipos de producción",
      category: "sop",
      type: "pdf",
      version: "2.3",
      status: "draft",
      lastModified: "12/09/2024 13:30",
      size: "2.1 MB",
      author: "Elena Vargas"
    }
  ]);

  const tabs = [
    { id: 'manufacturing', name: 'Pasos de Manufactura', icon: 'Factory' },
    { id: 'materials', name: 'Trazabilidad de Materiales', icon: 'Package' },
    { id: 'environmental', name: 'Monitoreo Ambiental', icon: 'Thermometer' },
    { id: 'documents', name: 'Documentos', icon: 'FileText' }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleStepUpdate = (stepId, updateData) => {
    console.log('Updating step:', stepId, updateData);
  };

  const handleSignature = (stepId, signatureData) => {
    console.log('Adding signature to step:', stepId, signatureData);
  };

  const handleMaterialUpdate = (materialId, updateData) => {
    console.log('Updating material:', materialId, updateData);
  };

  const handleEnvironmentalDataUpdate = (parameter, data) => {
    console.log('Updating environmental data:', parameter, data);
  };

  const handleDocumentUpdate = (documentId, updateData) => {
    console.log('Updating document:', documentId, updateData);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        onToggle={handleSidebarToggle}
      />
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6">
          {/* Breadcrumb */}
          <BreadcrumbTrail />

          {/* Batch Header */}
          <BatchHeader 
            batchData={batchData}
            onStatusChange={(status) => console.log('Status changed:', status)}
          />

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg mb-6">
            <div className="border-b border-border">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'manufacturing' && (
                <ManufacturingSteps
                  steps={batchData?.manufacturingSteps}
                  onStepUpdate={handleStepUpdate}
                  onSignature={handleSignature}
                />
              )}

              {activeTab === 'materials' && (
                <MaterialTraceability
                  materials={materials}
                  onMaterialUpdate={handleMaterialUpdate}
                />
              )}

              {activeTab === 'environmental' && (
                <EnvironmentalMonitoring
                  environmentalData={environmentalData}
                  onDataUpdate={handleEnvironmentalDataUpdate}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentManagement
                  documents={documents}
                  onDocumentUpdate={handleDocumentUpdate}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleMobileMenuToggle}
        />
      )}
    </div>
  );
};

export default BatchRecordManagement;