import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentManagement = ({ documents, onDocumentUpdate }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'Todos los Documentos', count: documents?.length },
    { id: 'batch-records', name: 'Registros de Lote', count: documents?.filter(d => d?.category === 'batch-records')?.length },
    { id: 'sop', name: 'Procedimientos (SOP)', count: documents?.filter(d => d?.category === 'sop')?.length },
    { id: 'specifications', name: 'Especificaciones', count: documents?.filter(d => d?.category === 'specifications')?.length },
    { id: 'certificates', name: 'Certificados', count: documents?.filter(d => d?.category === 'certificates')?.length },
    { id: 'deviations', name: 'Desviaciones', count: documents?.filter(d => d?.category === 'deviations')?.length }
  ];

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'excel':
        return 'FileSpreadsheet';
      case 'word':
        return 'FileText';
      case 'image':
        return 'Image';
      default:
        return 'File';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'rejected':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const filteredDocuments = documents?.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc?.category === selectedCategory;
    const matchesSearch = doc?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         doc?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Gestión de Documentos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Control de versiones y documentación regulatoria
            </p>
          </div>
          <Button 
            variant="default" 
            iconName="Upload"
            onClick={() => setShowUploadModal(true)}
          >
            Subir Documento
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar documentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e?.target?.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" iconName="Filter" size="sm">
              Filtros
            </Button>
            <Button variant="outline" iconName="Download" size="sm">
              Exportar Lista
            </Button>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-64 border-r border-border p-4">
          <h3 className="text-sm font-medium text-foreground mb-3">Categorías</h3>
          <div className="space-y-1">
            {categories?.map((category) => (
              <button
                key={category?.id}
                onClick={() => setSelectedCategory(category?.id)}
                className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  selectedCategory === category?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <span>{category?.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedCategory === category?.id
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {category?.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Documents List */}
        <div className="flex-1">
          <div className="p-6">
            <div className="space-y-4">
              {filteredDocuments?.map((document) => (
                <div key={document?.id} className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name={getDocumentIcon(document?.type)} size={20} className="text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {document?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {document?.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                          <span>Versión {document?.version}</span>
                          <span>•</span>
                          <span>{document?.lastModified}</span>
                          <span>•</span>
                          <span>{document?.size}</span>
                          <span>•</span>
                          <span>Por {document?.author}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(document?.status)}`}>
                          {document?.status === 'approved' ? 'Aprobado' :
                           document?.status === 'pending' ? 'Pendiente' :
                           document?.status === 'draft' ? 'Borrador' :
                           document?.status === 'rejected' ? 'Rechazado' : document?.status}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            title="Ver documento"
                          >
                            <Icon name="Eye" size={14} className="text-muted-foreground" />
                          </button>
                          <button
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            title="Descargar"
                          >
                            <Icon name="Download" size={14} className="text-muted-foreground" />
                          </button>
                          <button
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            title="Compartir"
                          >
                            <Icon name="Share" size={14} className="text-muted-foreground" />
                          </button>
                          <button
                            className="p-2 rounded-md hover:bg-muted transition-colors"
                            title="Más opciones"
                          >
                            <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredDocuments?.length === 0 && (
                <div className="text-center py-12">
                  <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    No se encontraron documentos
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay documentos en esta categoría'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg w-full max-w-md mx-4">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Subir Nuevo Documento
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nombre del Documento
                  </label>
                  <input
                    type="text"
                    placeholder="Ingrese el nombre del documento"
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Categoría
                  </label>
                  <select className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="">Seleccionar categoría</option>
                    <option value="batch-records">Registros de Lote</option>
                    <option value="sop">Procedimientos (SOP)</option>
                    <option value="specifications">Especificaciones</option>
                    <option value="certificates">Certificados</option>
                    <option value="deviations">Desviaciones</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Descripción del documento"
                    className="w-full px-3 py-2 border border-border rounded-md text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Archivo
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra y suelta tu archivo aquí, o
                    </p>
                    <Button variant="outline" size="sm">
                      Seleccionar Archivo
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  iconName="Upload"
                >
                  Subir Documento
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement;