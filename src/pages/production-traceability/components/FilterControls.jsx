import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ onFilterChange, onExport, onReset }) => {
  const [filters, setFilters] = useState({
    batchNumber: '',
    dateFrom: '',
    dateTo: '',
    productType: '',
    productionLine: '',
    status: ''
  });

  const productTypeOptions = [
    { value: '', label: 'Todos los productos' },
    { value: 'tablets', label: 'Tabletas' },
    { value: 'capsules', label: 'Cápsulas' },
    { value: 'syrup', label: 'Jarabe' },
    { value: 'injection', label: 'Inyección' }
  ];

  const productionLineOptions = [
    { value: '', label: 'Todas las líneas' },
    { value: 'line-a', label: 'Línea A - Sólidos' },
    { value: 'line-b', label: 'Línea B - Líquidos' },
    { value: 'line-c', label: 'Línea C - Inyectables' },
    { value: 'line-d', label: 'Línea D - Empaque' }
  ];

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'in-progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'deviation', label: 'Con Desviación' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      batchNumber: '',
      dateFrom: '',
      dateTo: '',
      productType: '',
      productionLine: '',
      status: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Filtros de Búsqueda</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            onClick={onExport}
          >
            Exportar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={handleReset}
          >
            Limpiar
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Input
          label="Número de Lote"
          type="text"
          placeholder="Ej: LOT-2024-001"
          value={filters?.batchNumber}
          onChange={(e) => handleFilterChange('batchNumber', e?.target?.value)}
          className="col-span-1"
        />

        <Input
          label="Fecha Desde"
          type="date"
          value={filters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
          className="col-span-1"
        />

        <Input
          label="Fecha Hasta"
          type="date"
          value={filters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
          className="col-span-1"
        />

        <Select
          label="Tipo de Producto"
          options={productTypeOptions}
          value={filters?.productType}
          onChange={(value) => handleFilterChange('productType', value)}
          className="col-span-1"
        />

        <Select
          label="Línea de Producción"
          options={productionLineOptions}
          value={filters?.productionLine}
          onChange={(value) => handleFilterChange('productionLine', value)}
          className="col-span-1"
        />

        <Select
          label="Estado"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          className="col-span-1"
        />
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} />
          <span>Los filtros se aplican automáticamente al cambiar los valores</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Search"
          >
            Búsqueda Avanzada
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;