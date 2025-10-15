import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BatchSelector = ({ selectedBatch, onBatchChange, onNewBatch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const batchOptions = [
    {
      value: 'LOT-2024-001',
      label: 'LOT-2024-001 - Paracetamol 500mg',
      description: 'Línea A - En Progreso'
    },
    {
      value: 'LOT-2024-002',
      label: 'LOT-2024-002 - Ibuprofeno 400mg',
      description: 'Línea B - Completado'
    },
    {
      value: 'LOT-2024-003',
      label: 'LOT-2024-003 - Amoxicilina 250mg',
      description: 'Línea C - Pendiente'
    },
    {
      value: 'LOT-2024-004',
      label: 'LOT-2024-004 - Omeprazol 20mg',
      description: 'Línea A - Con Desviación'
    },
    {
      value: 'LOT-2024-005',
      label: 'LOT-2024-005 - Metformina 850mg',
      description: 'Línea D - En Progreso'
    }
  ];

  const selectedBatchInfo = batchOptions?.find(batch => batch?.value === selectedBatch);

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Selección de Lote</h2>
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          onClick={onNewBatch}
        >
          Nuevo Lote
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Select
            label="Lote de Producción"
            placeholder="Seleccionar lote para rastrear..."
            options={batchOptions}
            value={selectedBatch}
            onChange={onBatchChange}
            searchable
            clearable
            description="Busque por número de lote o nombre del producto"
          />
        </div>

        {selectedBatchInfo && (
          <div className="bg-muted/30 rounded-lg p-4">
            <h3 className="font-medium text-foreground mb-3">Información del Lote</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Producto:</span>
                <span className="font-medium text-foreground">
                  {selectedBatchInfo?.label?.split(' - ')?.[1]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estado:</span>
                <span className="font-medium text-foreground">
                  {selectedBatchInfo?.description?.split(' - ')?.[1]}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Línea:</span>
                <span className="font-medium text-foreground">
                  {selectedBatchInfo?.description?.split(' - ')?.[0]}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                iconName="FileText"
              >
                Ver Registro
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="BarChart3"
              >
                Análisis
              </Button>
            </div>
          </div>
        )}
      </div>
      {selectedBatch && (
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Última actualización: {new Date()?.toLocaleTimeString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
            >
              Actualizar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Share"
            >
              Compartir
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchSelector;