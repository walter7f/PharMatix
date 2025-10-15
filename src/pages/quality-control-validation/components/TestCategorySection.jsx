import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const TestCategorySection = ({ category, tests, onTestUpdate, onSignature, isExpanded, onToggle }) => {
  const [localTests, setLocalTests] = useState(tests);

  const handleTestValueChange = (testId, field, value) => {
    const updatedTests = localTests?.map(test => 
      test?.id === testId ? { ...test, [field]: value } : test
    );
    setLocalTests(updatedTests);
    onTestUpdate(category?.id, updatedTests);
  };

  const calculateResult = (test) => {
    if (!test?.measuredValue || !test?.specification) return 'Pendiente';
    
    const measured = parseFloat(test?.measuredValue);
    const spec = test?.specification;
    
    if (spec?.min !== undefined && spec?.max !== undefined) {
      return (measured >= spec?.min && measured <= spec?.max) ? 'Conforme' : 'No Conforme';
    }
    
    if (spec?.target !== undefined) {
      const tolerance = spec?.tolerance || 0;
      return Math.abs(measured - spec?.target) <= tolerance ? 'Conforme' : 'No Conforme';
    }
    
    return 'Pendiente';
  };

  const getResultColor = (result) => {
    switch (result) {
      case 'Conforme':
        return 'text-success bg-success/10';
      case 'No Conforme':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  const getCategoryIcon = (categoryType) => {
    switch (categoryType?.toLowerCase()) {
      case 'physical':
        return 'Scale';
      case 'chemical':
        return 'TestTube';
      case 'microbiological':
        return 'Microscope';
      default:
        return 'FlaskConical';
    }
  };

  const allTestsCompleted = localTests?.every(test => test?.measuredValue && test?.technician);
  const hasNonConformingTests = localTests?.some(test => calculateResult(test) === 'No Conforme');

  return (
    <div className="bg-card border border-border rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            hasNonConformingTests ? 'bg-error/10' : allTestsCompleted ? 'bg-success/10' : 'bg-muted'
          }`}>
            <Icon 
              name={getCategoryIcon(category?.type)} 
              size={20} 
              className={hasNonConformingTests ? 'text-error' : allTestsCompleted ? 'text-success' : 'text-muted-foreground'}
            />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-foreground">{category?.name}</h3>
            <p className="text-sm text-muted-foreground">
              {localTests?.filter(test => test?.measuredValue)?.length} de {localTests?.length} pruebas completadas
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {category?.requiresSignature && category?.signedBy && (
            <div className="flex items-center space-x-1 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-xs">Firmado</span>
            </div>
          )}
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={20} 
            className="text-muted-foreground" 
          />
        </div>
      </button>
      {isExpanded && (
        <div className="border-t border-border p-4">
          <div className="space-y-4">
            {localTests?.map((test) => {
              const result = calculateResult(test);
              
              return (
                <div key={test?.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">{test?.parameter}</h4>
                      <p className="text-sm text-muted-foreground">{test?.method}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Especificación: {test?.specification?.display}
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getResultColor(result)}`}>
                      {result}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Valor Medido"
                      type="number"
                      step="0.01"
                      value={test?.measuredValue || ''}
                      onChange={(e) => handleTestValueChange(test?.id, 'measuredValue', e?.target?.value)}
                      placeholder="Ingrese el valor"
                      className="mb-0"
                    />
                    
                    <Input
                      label="Técnico Responsable"
                      type="text"
                      value={test?.technician || ''}
                      onChange={(e) => handleTestValueChange(test?.id, 'technician', e?.target?.value)}
                      placeholder="Nombre del técnico"
                      className="mb-0"
                    />
                    
                    <Input
                      label="Fecha de Prueba"
                      type="datetime-local"
                      value={test?.testDate || ''}
                      onChange={(e) => handleTestValueChange(test?.id, 'testDate', e?.target?.value)}
                      className="mb-0"
                    />
                  </div>
                  {test?.notes !== undefined && (
                    <div className="mt-3">
                      <Input
                        label="Observaciones"
                        type="text"
                        value={test?.notes || ''}
                        onChange={(e) => handleTestValueChange(test?.id, 'notes', e?.target?.value)}
                        placeholder="Observaciones adicionales (opcional)"
                        className="mb-0"
                      />
                    </div>
                  )}
                  {result === 'No Conforme' && (
                    <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-md">
                      <div className="flex items-center space-x-2 text-error mb-2">
                        <Icon name="AlertTriangle" size={16} />
                        <span className="text-sm font-medium">Resultado No Conforme</span>
                      </div>
                      <p className="text-xs text-error/80">
                        Este resultado requiere investigación y posible generación de desviación.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {category?.requiresSignature && (
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={!!category?.signedBy}
                    onChange={(e) => {
                      if (e?.target?.checked && allTestsCompleted) {
                        onSignature(category?.id, 'Dr. María González', new Date()?.toISOString());
                      }
                    }}
                    disabled={!allTestsCompleted}
                  />
                  <span className="text-sm font-medium text-foreground">
                    Confirmo que todos los resultados son correctos
                  </span>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!allTestsCompleted || !!category?.signedBy}
                  onClick={() => onSignature(category?.id, 'Dr. María González', new Date()?.toISOString())}
                  iconName="PenTool"
                  iconPosition="left"
                >
                  {category?.signedBy ? 'Firmado' : 'Firmar Electrónicamente'}
                </Button>
              </div>
              
              {category?.signedBy && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Firmado por {category?.signedBy} el {new Date(category.signedAt)?.toLocaleString('es-ES')}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestCategorySection;