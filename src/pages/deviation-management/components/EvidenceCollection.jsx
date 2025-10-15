import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Image from '../../../components/AppImage';

const EvidenceCollection = ({ deviation, onAddEvidence, onRemoveEvidence }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newEvidence, setNewEvidence] = useState({
    type: 'document',
    title: '',
    description: '',
    file: null
  });

  const evidenceTypes = [
    { value: 'document', label: 'Documento', icon: 'FileText' },
    { value: 'photo', label: 'Fotografía', icon: 'Camera' },
    { value: 'witness', label: 'Testimonio', icon: 'Users' },
    { value: 'data', label: 'Datos/Registros', icon: 'BarChart3' },
    { value: 'video', label: 'Video', icon: 'Video' }
  ];

  const mockEvidence = [
    {
      id: 1,
      type: 'document',
      title: 'Registro de Temperatura del Equipo',
      description: 'Datos de temperatura durante el período de la desviación',
      uploadedBy: 'María González',
      uploadDate: '2025-01-12 14:30',
      fileSize: '2.4 MB',
      fileName: 'temp_log_batch_2025001.pdf'
    },
    {
      id: 2,
      type: 'photo',
      title: 'Condición del Equipo',
      description: 'Fotografías del estado del equipo al momento de la detección',
      uploadedBy: 'Carlos Ruiz',
      uploadDate: '2025-01-12 15:45',
      fileSize: '8.7 MB',
      fileName: 'equipment_photos.zip',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      type: 'witness',
      title: 'Declaración del Operador',
      description: 'Testimonio del operador presente durante el incidente',
      uploadedBy: 'Ana Martínez',
      uploadDate: '2025-01-13 09:15',
      fileSize: '156 KB',
      fileName: 'witness_statement_001.pdf'
    },
    {
      id: 4,
      type: 'data',
      title: 'Datos de Proceso',
      description: 'Registros del sistema de control de proceso durante el evento',
      uploadedBy: 'Luis Fernández',
      uploadDate: '2025-01-13 11:20',
      fileSize: '5.2 MB',
      fileName: 'process_data_export.xlsx'
    }
  ];

  const getEvidenceIcon = (type) => {
    const evidenceType = evidenceTypes?.find(t => t?.value === type);
    return evidenceType ? evidenceType?.icon : 'File';
  };

  const getEvidenceColor = (type) => {
    switch (type) {
      case 'document':
        return 'text-blue-600 bg-blue-50';
      case 'photo':
        return 'text-green-600 bg-green-50';
      case 'witness':
        return 'text-purple-600 bg-purple-50';
      case 'data':
        return 'text-orange-600 bg-orange-50';
      case 'video':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleAddEvidence = () => {
    if (newEvidence?.title && newEvidence?.description) {
      onAddEvidence({
        ...newEvidence,
        id: Date.now(),
        uploadedBy: 'Usuario Actual',
        uploadDate: new Date()?.toLocaleString('es-ES'),
        fileSize: '0 KB'
      });
      setNewEvidence({
        type: 'document',
        title: '',
        description: '',
        file: null
      });
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="Paperclip" size={20} className="text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Recolección de Evidencias</h3>
          <div className="px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
            {mockEvidence?.length} elementos
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          size="sm"
        >
          {isExpanded ? 'Contraer' : 'Expandir'}
        </Button>
      </div>
      {isExpanded && (
        <div className="p-6">
          {/* Add New Evidence Form */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-foreground mb-4">Agregar Nueva Evidencia</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Tipo de Evidencia</label>
                <select
                  value={newEvidence?.type}
                  onChange={(e) => setNewEvidence(prev => ({ ...prev, type: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {evidenceTypes?.map(type => (
                    <option key={type?.value} value={type?.value}>{type?.label}</option>
                  ))}
                </select>
              </div>
              
              <Input
                label="Título"
                type="text"
                placeholder="Nombre descriptivo de la evidencia"
                value={newEvidence?.title}
                onChange={(e) => setNewEvidence(prev => ({ ...prev, title: e?.target?.value }))}
                required
              />
            </div>
            
            <Input
              label="Descripción"
              type="textarea"
              placeholder="Descripción detallada de la evidencia y su relevancia para la investigación"
              value={newEvidence?.description}
              onChange={(e) => setNewEvidence(prev => ({ ...prev, description: e?.target?.value }))}
              required
              className="mb-4 min-h-20"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                iconName="Upload"
                iconPosition="left"
                size="sm"
              >
                Seleccionar Archivo
              </Button>
              
              <Button
                variant="default"
                onClick={handleAddEvidence}
                iconName="Plus"
                iconPosition="left"
                size="sm"
              >
                Agregar Evidencia
              </Button>
            </div>
          </div>

          {/* Evidence List */}
          <div className="space-y-4">
            {mockEvidence?.map((evidence) => (
              <div key={evidence?.id} className="border border-border rounded-lg p-4 hover:bg-muted/20 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  {/* Evidence Type Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEvidenceColor(evidence?.type)}`}>
                    <Icon name={getEvidenceIcon(evidence?.type)} size={20} />
                  </div>
                  
                  {/* Evidence Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-foreground mb-1">{evidence?.title}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{evidence?.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Icon name="User" size={12} />
                            {evidence?.uploadedBy}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="Calendar" size={12} />
                            {evidence?.uploadDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="HardDrive" size={12} />
                            {evidence?.fileSize}
                          </span>
                          <span className="flex items-center gap-1">
                            <Icon name="File" size={12} />
                            {evidence?.fileName}
                          </span>
                        </div>
                      </div>
                      
                      {/* Thumbnail for photos */}
                      {evidence?.type === 'photo' && evidence?.thumbnail && (
                        <div className="w-16 h-16 rounded-md overflow-hidden border border-border">
                          <Image
                            src={evidence?.thumbnail}
                            alt={evidence?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Download"
                        iconPosition="left"
                      >
                        Descargar
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        iconPosition="left"
                      >
                        Ver
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        iconPosition="left"
                        onClick={() => onRemoveEvidence(evidence?.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EvidenceCollection;