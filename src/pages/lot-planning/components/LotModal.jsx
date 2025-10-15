import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { lotScheduleService, productService, userService, resourceService } from '../../../services/planningService';

const LotModal = ({ isOpen, onClose, editingLot, onSaved }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    lot_number: '',
    product_id: '',
    scheduled_start: '',
    scheduled_end: '',
    status: 'planned',
    priority: 'medium',
    batch_quantity: '',
    assigned_to: '',
    notes: ''
  });

  // Dropdown options
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableResources, setAvailableResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);

  // Load dropdown data
  const loadOptions = async () => {
    try {
      const [productsResult, usersResult, resourcesResult] = await Promise.all([
        productService?.getAllProducts(),
        userService?.getAllUsers(),
        resourceService?.getAvailableResources()
      ]);

      if (!productsResult?.error) setProducts(productsResult?.data || []);
      if (!usersResult?.error) setUsers(usersResult?.data || []);
      if (!resourcesResult?.error) setAvailableResources(resourcesResult?.data || []);
    } catch (error) {
      setError('Error loading form options');
    }
  };

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      loadOptions();
      
      if (editingLot) {
        // Edit mode
        const start = editingLot?.scheduled_start ? new Date(editingLot?.scheduled_start) : null;
        const end = editingLot?.scheduled_end ? new Date(editingLot?.scheduled_end) : null;
        
        setFormData({
          lot_number: editingLot?.lot_number || '',
          product_id: editingLot?.product_id || '',
          scheduled_start: start ? start?.toISOString()?.slice(0, 16) : '',
          scheduled_end: end ? end?.toISOString()?.slice(0, 16) : '',
          status: editingLot?.status || 'planned',
          priority: editingLot?.priority || 'medium',
          batch_quantity: editingLot?.batch_quantity?.toString() || '',
          assigned_to: editingLot?.assigned_to || '',
          notes: editingLot?.notes || ''
        });
      } else {
        // Create mode - reset form
        const now = new Date();
        const startTime = new Date(now);
        startTime?.setHours(8, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime?.setHours(17, 0, 0, 0);
        
        setFormData({
          lot_number: '',
          product_id: '',
          scheduled_start: startTime?.toISOString()?.slice(0, 16),
          scheduled_end: endTime?.toISOString()?.slice(0, 16),
          status: 'planned',
          priority: 'medium',
          batch_quantity: '',
          assigned_to: '',
          notes: ''
        });
      }
      
      setError(null);
      setSuccess(false);
      setSelectedResources([]);
    }
  }, [isOpen, editingLot]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || '' : value
    }));
  };

  // Handle product change - update batch size
  const handleProductChange = (productId) => {
    const selectedProduct = products?.find(p => p?.id === productId);
    setFormData(prev => ({
      ...prev,
      product_id: productId,
      batch_quantity: selectedProduct?.batch_size?.toString() || ''
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData?.lot_number?.trim()) {
      errors.lot_number = 'Número de lote requerido';
    }
    
    if (!formData?.product_id) {
      errors.product_id = 'Producto requerido';
    }
    
    if (!formData?.scheduled_start) {
      errors.scheduled_start = 'Fecha de inicio requerida';
    }
    
    if (!formData?.scheduled_end) {
      errors.scheduled_end = 'Fecha de fin requerida';
    }
    
    if (formData?.scheduled_start && formData?.scheduled_end) {
      const start = new Date(formData?.scheduled_start);
      const end = new Date(formData?.scheduled_end);
      if (end <= start) {
        errors.scheduled_end = 'La fecha de fin debe ser posterior al inicio';
      }
    }
    
    if (!formData?.batch_quantity || formData?.batch_quantity <= 0) {
      errors.batch_quantity = 'Cantidad del lote requerida';
    }

    return errors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors)?.length > 0) {
      setError('Por favor, completa todos los campos requeridos correctamente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        batch_quantity: parseFloat(formData?.batch_quantity),
        created_by: user?.id,
        ...(editingLot ? {} : { created_by: user?.id })
      };

      let result;
      if (editingLot) {
        result = await lotScheduleService?.updateLot(editingLot?.id, submitData);
      } else {
        result = await lotScheduleService?.createLot(submitData);
      }

      if (result?.error) {
        setError(`Error: ${result?.error?.message}`);
        return;
      }

      // If resources were selected, assign them
      if (selectedResources?.length > 0 && result?.data) {
        for (const resourceId of selectedResources) {
          await resourceService?.assignResourceToLot(
            result?.data?.id,
            resourceId,
            formData?.scheduled_start,
            formData?.scheduled_end
          );
        }
      }

      setSuccess(true);
      setTimeout(() => {
        onSaved?.();
      }, 1000);

    } catch (error) {
      setError(`Error inesperado: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle resource selection
  const handleResourceToggle = (resourceId) => {
    setSelectedResources(prev => 
      prev?.includes(resourceId) 
        ? prev?.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  if (!isOpen) return null;

  // Status options
  const statusOptions = [
    { value: 'planned', label: 'Planificado' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
    { value: 'on_hold', label: 'En Espera' }
  ];

  // Priority options
  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingLot ? 'Editar Lote' : 'Nuevo Lote'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            iconName="X"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="Check" size={16} className="text-green-600" />
                <p className="text-sm text-green-600 font-medium">
                  {editingLot ? 'Lote actualizado exitosamente' : 'Lote creado exitosamente'}
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} className="text-error" />
                <p className="text-sm text-error font-medium">Error</p>
              </div>
              <p className="text-sm text-error mt-1">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Lot Number */}
              <Input
                label="Número de Lote *"
                name="lot_number"
                value={formData?.lot_number}
                onChange={handleInputChange}
                placeholder="LOT-XXX-001"
                required
                disabled={loading}
              />

              {/* Product */}
              <Select
                label="Producto *"
                name="product_id"
                value={formData?.product_id}
                onChange={(value) => handleProductChange(value)}
                required
                disabled={loading}
              >
                <option value="">Seleccionar producto...</option>
                {products?.map(product => (
                  <option key={product?.id} value={product?.id}>
                    {product?.product_code} - {product?.product_name}
                  </option>
                ))}
              </Select>

              {/* Scheduled Start */}
              <Input
                label="Inicio Programado *"
                name="scheduled_start"
                type="datetime-local"
                value={formData?.scheduled_start}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              {/* Scheduled End */}
              <Input
                label="Fin Programado *"
                name="scheduled_end"
                type="datetime-local"
                value={formData?.scheduled_end}
                onChange={handleInputChange}
                required
                disabled={loading}
              />

              {/* Status */}
              <Select
                label="Estado"
                name="status"
                value={formData?.status}
                onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={loading}
              >
                {statusOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </Select>

              {/* Priority */}
              <Select
                label="Prioridad"
                name="priority"
                value={formData?.priority}
                onChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                disabled={loading}
              >
                {priorityOptions?.map(option => (
                  <option key={option?.value} value={option?.value}>
                    {option?.label}
                  </option>
                ))}
              </Select>

              {/* Batch Quantity */}
              <Input
                label="Cantidad del Lote *"
                name="batch_quantity"
                type="number"
                value={formData?.batch_quantity}
                onChange={handleInputChange}
                placeholder="10000"
                required
                disabled={loading}
                step="0.01"
              />

              {/* Assigned To */}
              <Select
                label="Asignado a"
                name="assigned_to"
                value={formData?.assigned_to}
                onChange={(value) => setFormData(prev => ({ ...prev, assigned_to: value }))}
                disabled={loading}
              >
                <option value="">Sin asignar...</option>
                {users?.map(user => (
                  <option key={user?.id} value={user?.id}>
                    {user?.full_name} ({user?.role})
                  </option>
                ))}
              </Select>
            </div>

            {/* Resources Selection */}
            {availableResources?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Recursos Asignados
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {availableResources?.map(resource => (
                    <div
                      key={resource?.id}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-colors
                        ${selectedResources?.includes(resource?.id)
                          ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }
                      `}
                      onClick={() => handleResourceToggle(resource?.id)}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon 
                          name={selectedResources?.includes(resource?.id) ? 'CheckSquare' : 'Square'} 
                          size={16} 
                          className={selectedResources?.includes(resource?.id) ? 'text-primary' : 'text-muted-foreground'} 
                        />
                        <div>
                          <div className="text-sm font-medium">{resource?.resource_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {resource?.resource_type} | Capacidad: {resource?.capacity}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Notas
              </label>
              <textarea
                name="notes"
                value={formData?.notes}
                onChange={handleInputChange}
                placeholder="Notas adicionales sobre el lote..."
                className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading || success}
                iconName="Save"
              >
                {editingLot ? 'Actualizar' : 'Crear'} Lote
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LotModal;