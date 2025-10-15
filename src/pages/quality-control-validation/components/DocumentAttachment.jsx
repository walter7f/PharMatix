import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentAttachment = ({ attachments, onAttachmentAdd, onAttachmentRemove, onAttachmentView }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFiles(e?.dataTransfer?.files);
    }
  };

  const handleFileInput = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFiles(e?.target?.files);
    }
  };

  const handleFiles = (files) => {
    Array.from(files)?.forEach(file => {
      const newAttachment = {
        id: Date.now() + Math.random(),
        name: file?.name,
        size: file?.size,
        type: file?.type,
        uploadedAt: new Date()?.toISOString(),
        uploadedBy: 'Dr. María González',
        category: getDocumentCategory(file?.name)
      };
      onAttachmentAdd(newAttachment);
    });
  };

  const getDocumentCategory = (filename) => {
    const extension = filename?.split('.')?.pop()?.toLowerCase();
    if (['pdf']?.includes(extension)) return 'certificate';
    if (['jpg', 'jpeg', 'png']?.includes(extension)) return 'image';
    if (['doc', 'docx']?.includes(extension)) return 'report';
    return 'other';
  };

  const getFileIcon = (type, category) => {
    if (category === 'certificate') return 'FileText';
    if (category === 'image') return 'Image';
    if (category === 'report') return 'FileSpreadsheet';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'certificate': return 'Certificado';
      case 'image': return 'Imagen';
      case 'report': return 'Reporte';
      default: return 'Documento';
    }
  };

  const documentCategories = [
    { id: 'certificate', label: 'Certificados de Análisis', count: attachments?.filter(a => a?.category === 'certificate')?.length },
    { id: 'image', label: 'Imágenes de Prueba', count: attachments?.filter(a => a?.category === 'image')?.length },
    { id: 'report', label: 'Reportes de Laboratorio', count: attachments?.filter(a => a?.category === 'report')?.length },
    { id: 'other', label: 'Otros Documentos', count: attachments?.filter(a => a?.category === 'other')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Paperclip" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Documentos Adjuntos</h3>
          <span className="text-sm text-muted-foreground">({attachments?.length})</span>
        </div>
      </div>
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 mb-6 ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">
          Arrastra archivos aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          PDF, DOC, JPG, PNG hasta 10MB
        </p>
        
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById('file-upload')?.click()}
          iconName="Plus"
          iconPosition="left"
        >
          Seleccionar Archivos
        </Button>
      </div>
      {/* Document Categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {documentCategories?.map(category => (
          <div key={category?.id} className="bg-muted/30 rounded-lg p-3 text-center">
            <p className="text-lg font-semibold text-foreground">{category?.count}</p>
            <p className="text-xs text-muted-foreground">{category?.label}</p>
          </div>
        ))}
      </div>
      {/* Attachments List */}
      {attachments?.length > 0 ? (
        <div className="space-y-3">
          {attachments?.map((attachment) => (
            <div key={attachment?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={getFileIcon(attachment?.type, attachment?.category)} 
                    size={18} 
                    className="text-primary" 
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{attachment?.name}</p>
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <span>{formatFileSize(attachment?.size)}</span>
                    <span>•</span>
                    <span>{getCategoryLabel(attachment?.category)}</span>
                    <span>•</span>
                    <span>Subido por {attachment?.uploadedBy}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(attachment.uploadedAt)?.toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAttachmentView(attachment)}
                  iconName="Eye"
                  className="h-8 w-8 p-0"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAttachmentRemove(attachment?.id)}
                  iconName="Trash2"
                  className="h-8 w-8 p-0 text-error hover:text-error"
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No hay documentos adjuntos</p>
          <p className="text-xs text-muted-foreground">
            Los documentos adjuntos aparecerán aquí una vez que los subas
          </p>
        </div>
      )}
      {/* Required Documents Notice */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">Documentos Requeridos para Auditoría</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Certificados de calibración de equipos</li>
              <li>• Certificados de análisis de materias primas</li>
              <li>• Registros fotográficos de muestras</li>
              <li>• Reportes de métodos analíticos validados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAttachment;