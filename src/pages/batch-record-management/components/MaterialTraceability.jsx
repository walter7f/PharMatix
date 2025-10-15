import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MaterialTraceability = ({ materials, onMaterialUpdate }) => {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showTraceabilityModal, setShowTraceabilityModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'expired':
        return 'bg-error text-error-foreground';
      case 'quarantine':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleTraceabilityView = (material) => {
    setSelectedMaterial(material);
    setShowTraceabilityModal(true);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Trazabilidad de Materiales</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Registro completo de materias primas y componentes utilizados
            </p>
          </div>
          <Button variant="outline" iconName="Download" size="sm">
            Exportar Reporte
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Material
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Código/Lote
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Proveedor
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Cantidad
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Fecha Vencimiento
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {materials?.map((material) => (
              <tr key={material?.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Package" size={16} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {material?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {material?.specification}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {material?.batchNumber}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {material?.materialCode}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-foreground">{material?.supplier}</p>
                    <p className="text-xs text-muted-foreground">
                      COA: {material?.coaNumber}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {material?.quantityUsed} {material?.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      de {material?.quantityAvailable} {material?.unit}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-foreground">{material?.expiryDate}</p>
                  <p className={`text-xs ${
                    material?.daysToExpiry < 30 ? 'text-warning' : 
                    material?.daysToExpiry < 7 ? 'text-error' : 'text-muted-foreground'
                  }`}>
                    {material?.daysToExpiry} días restantes
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(material?.status)}`}>
                    {material?.status === 'verified' ? 'Verificado' :
                     material?.status === 'pending' ? 'Pendiente' :
                     material?.status === 'expired' ? 'Vencido' :
                     material?.status === 'quarantine' ? 'Cuarentena' : material?.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleTraceabilityView(material)}
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Ver trazabilidad completa"
                    >
                      <Icon name="Search" size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Descargar COA"
                    >
                      <Icon name="Download" size={14} className="text-muted-foreground" />
                    </button>
                    <button
                      className="p-2 rounded-md hover:bg-muted transition-colors"
                      title="Reportar problema"
                    >
                      <Icon name="AlertTriangle" size={14} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Material Summary */}
      <div className="p-6 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {materials?.filter(m => m?.status === 'verified')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Verificados</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {materials?.filter(m => m?.status === 'pending')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Pendientes</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-error">
              {materials?.filter(m => m?.status === 'expired')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Vencidos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {materials?.length}
            </p>
            <p className="text-sm text-muted-foreground">Total</p>
          </div>
        </div>
      </div>
      {/* Traceability Modal */}
      {showTraceabilityModal && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Trazabilidad Completa
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedMaterial?.name} - Lote {selectedMaterial?.batchNumber}
                  </p>
                </div>
                <button
                  onClick={() => setShowTraceabilityModal(false)}
                  className="p-2 rounded-md hover:bg-muted transition-colors"
                >
                  <Icon name="X" size={16} className="text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Material Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Información del Material
                    </h4>
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Código:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.materialCode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Especificación:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.specification}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Grado:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.grade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Información del Proveedor
                    </h4>
                    <div className="bg-muted rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Proveedor:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.supplier}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">País de Origen:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.countryOfOrigin}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Fecha de Manufactura:</span>
                        <span className="text-sm font-medium text-foreground">
                          {selectedMaterial?.manufacturingDate}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quality Data */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Datos de Calidad
                    </h4>
                    <div className="space-y-3">
                      {selectedMaterial?.qualityTests?.map((test) => (
                        <div key={test?.id} className="bg-muted rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">
                              {test?.parameter}
                            </span>
                            <span className={`text-sm ${
                              test?.result === 'Cumple' ? 'text-success' : 'text-error'
                            }`}>
                              {test?.result}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Valor: {test?.value} | Especificación: {test?.specification}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Historial de Uso
                    </h4>
                    <div className="space-y-2">
                      {selectedMaterial?.usageHistory?.map((usage) => (
                        <div key={usage?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Lote {usage?.batchNumber}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {usage?.date}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-foreground">
                              {usage?.quantity} {selectedMaterial?.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {usage?.operator}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={() => setShowTraceabilityModal(false)}>
                  Cerrar
                </Button>
                <Button variant="default" iconName="Download">
                  Descargar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialTraceability;