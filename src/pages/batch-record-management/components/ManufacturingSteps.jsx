import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ManufacturingSteps = ({ steps, onStepUpdate, onSignature }) => {
  const [expandedStep, setExpandedStep] = useState(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState(null);

  const getStepStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'in-progress':
        return { name: 'Clock', color: 'text-warning' };
      case 'pending':
        return { name: 'Circle', color: 'text-muted-foreground' };
      case 'requires-signature':
        return { name: 'FileSignature', color: 'text-primary' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const handleSignatureRequest = (step) => {
    setSelectedStep(step);
    setShowSignatureModal(true);
  };

  const handleSignatureSubmit = (signature) => {
    if (selectedStep) {
      onSignature(selectedStep?.id, signature);
      setShowSignatureModal(false);
      setSelectedStep(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h2 className="text-xl font-semibold text-foreground">Pasos de Manufactura</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Registro secuencial de actividades de producción
        </p>
      </div>
      <div className="divide-y divide-border">
        {steps?.map((step, index) => {
          const statusIcon = getStepStatusIcon(step?.status);
          const isExpanded = expandedStep === step?.id;

          return (
            <div key={step?.id} className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <Icon 
                    name={statusIcon?.name} 
                    size={20} 
                    className={statusIcon?.color}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-foreground">
                        Paso {step?.stepNumber}: {step?.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step?.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm">
                        <span className="text-muted-foreground">
                          Duración estimada: {step?.estimatedDuration}
                        </span>
                        {step?.operator && (
                          <span className="text-muted-foreground">
                            Operador: {step?.operator}
                          </span>
                        )}
                        {step?.completedAt && (
                          <span className="text-success">
                            Completado: {step?.completedAt}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {step?.status === 'requires-signature' && (
                        <Button
                          variant="default"
                          size="sm"
                          iconName="FileSignature"
                          onClick={() => handleSignatureRequest(step)}
                        >
                          Firmar
                        </Button>
                      )}
                      
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step?.id)}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                      >
                        <Icon 
                          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                          className="text-muted-foreground"
                        />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 space-y-6">
                      {/* Process Parameters */}
                      {step?.parameters && step?.parameters?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Parámetros del Proceso
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {step?.parameters?.map((param) => (
                              <div key={param?.id} className="bg-muted rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-foreground">
                                    {param?.name}
                                  </span>
                                  <span className={`text-sm ${
                                    param?.withinLimits ? 'text-success' : 'text-error'
                                  }`}>
                                    {param?.withinLimits ? 'Dentro de límites' : 'Fuera de límites'}
                                  </span>
                                </div>
                                <div className="text-lg font-semibold text-foreground">
                                  {param?.actualValue} {param?.unit}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Límites: {param?.lowerLimit} - {param?.upperLimit} {param?.unit}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Materials Used */}
                      {step?.materials && step?.materials?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Materiales Utilizados
                          </h4>
                          <div className="bg-muted rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-background">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                    Material
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                    Lote
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                    Cantidad
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                    Estado
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {step?.materials?.map((material) => (
                                  <tr key={material?.id}>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                      {material?.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                      {material?.batchNumber}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-foreground">
                                      {material?.quantity} {material?.unit}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                        material?.verified 
                                          ? 'bg-success text-success-foreground' 
                                          : 'bg-warning text-warning-foreground'
                                      }`}>
                                        {material?.verified ? 'Verificado' : 'Pendiente'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* Quality Checkpoints */}
                      {step?.qualityCheckpoints && step?.qualityCheckpoints?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Puntos de Control de Calidad
                          </h4>
                          <div className="space-y-3">
                            {step?.qualityCheckpoints?.map((checkpoint) => (
                              <div key={checkpoint?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Icon 
                                    name={checkpoint?.passed ? "CheckCircle" : "XCircle"} 
                                    size={16} 
                                    className={checkpoint?.passed ? "text-success" : "text-error"}
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {checkpoint?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {checkpoint?.description}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-foreground">
                                    {checkpoint?.result}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {checkpoint?.checkedBy}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Signatures */}
                      {step?.signatures && step?.signatures?.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-foreground mb-3">
                            Firmas Electrónicas
                          </h4>
                          <div className="space-y-3">
                            {step?.signatures?.map((signature) => (
                              <div key={signature?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Icon name="FileSignature" size={16} className="text-primary" />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {signature?.role}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {signature?.signedBy}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-foreground">
                                    {signature?.timestamp}
                                  </p>
                                  <p className="text-xs text-success">
                                    Verificado
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Electronic Signature Modal */}
      {showSignatureModal && selectedStep && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Firma Electrónica Requerida
              </h3>
              <button
                onClick={() => setShowSignatureModal(false)}
                className="p-2 rounded-md hover:bg-muted transition-colors"
              >
                <Icon name="X" size={16} className="text-muted-foreground" />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                Paso: {selectedStep?.title}
              </p>
              <p className="text-sm text-foreground">
                Se requiere su firma electrónica para completar este paso del proceso de manufactura.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Usuario
                </label>
                <input
                  type="text"
                  value="Dr. Sarah Chen"
                  disabled
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-foreground"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contraseña de Firma
                </label>
                <input
                  type="password"
                  placeholder="Ingrese su contraseña de firma"
                  className="w-full px-3 py-2 border border-border rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowSignatureModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="default"
                  fullWidth
                  iconName="FileSignature"
                  onClick={() => handleSignatureSubmit({
                    userId: 'user-123',
                    timestamp: new Date()?.toISOString(),
                    role: 'Quality Manager'
                  })}
                >
                  Firmar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturingSteps;