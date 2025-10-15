import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { calendarService, lotScheduleService, userService } from '../../../services/planningService';

const EventModal = ({ isOpen, onClose, editingEvent, onSaved }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'lot_emission',
    start_time: '',
    end_time: '',
    all_day: false,
    recurring_rule: '',
    lot_schedule_id: '',
    assigned_to: [],
    location: '',
    color: '#3B82F6'
  });

  // Dropdown options
  const [lotSchedules, setLotSchedules] = useState([]);
  const [users, setUsers] = useState([]);

  // Load options
  const loadOptions = async () => {
    try {
      const [lotsResult, usersResult] = await Promise.all([
        lotScheduleService?.getAllLots(),
        userService?.getAllUsers()
      ]);

      if (!lotsResult?.error) setLotSchedules(lotsResult?.data || []);
      if (!usersResult?.error) setUsers(usersResult?.data || []);
    } catch (error) {
      setError('Error loading form options');
    }
  };

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      loadOptions();
      
      if (editingEvent) {
        // Edit mode
        const start = editingEvent?.start_time ? new Date(editingEvent?.start_time) : null;
        const end = editingEvent?.end_time ? new Date(editingEvent?.end_time) : null;
        
        setFormData({
          title: editingEvent?.title || '',
          description: editingEvent?.description || '',
          event_type: editingEvent?.event_type || 'lot_emission',
          start_time: start ? start?.toISOString()?.slice(0, 16) : '',
          end_time: end ? end?.toISOString()?.slice(0, 16) : '',
          all_day: editingEvent?.all_day || false,
          recurring_rule: editingEvent?.recurring_rule || '',
          lot_schedule_id: editingEvent?.lot_schedule_id || '',
          assigned_to: Array.isArray(editingEvent?.assigned_to) ? editingEvent?.assigned_to : [],
          location: editingEvent?.location || '',
          color: editingEvent?.color || '#3B82F6'
        });
      } else {
        // Create mode - use provided date info or defaults
        let startTime, endTime;
        
        if (editingEvent?.start_time) {
          startTime = new Date(editingEvent?.start_time);
          endTime = new Date(editingEvent?.end_time || editingEvent?.start_time);
          if (startTime?.getTime() === endTime?.getTime()) {
            endTime?.setHours(endTime?.getHours() + 1);
          }
        } else {
          const now = new Date();
          startTime = new Date(now);
          startTime?.setHours(8, 0, 0, 0);
          endTime = new Date(startTime);
          endTime?.setHours(9, 0, 0, 0);
        }
        
        setFormData({
          title: '',
          description: '',
          event_type: editingEvent?.event_type || 'lot_emission',
          start_time: startTime?.toISOString()?.slice(0, 16),
          end_time: endTime?.toISOString()?.slice(0, 16),
          all_day: false,
          recurring_rule: '',
          lot_schedule_id: '',
          assigned_to: [],
          location: '',
          color: getEventTypeColor(editingEvent?.event_type || 'lot_emission')
        });
      }
      
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, editingEvent]);

  // Event type colors
  const getEventTypeColor = (eventType) => {
    const colors = {
      lot_emission: '#3B82F6',
      maintenance: '#F59E0B',
      training: '#10B981',
      audit: '#8B5CF6'
    };
    return colors?.[eventType] || '#6B7280';
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle event type change
  const handleEventTypeChange = (eventType) => {
    setFormData(prev => ({
      ...prev,
      event_type: eventType,
      color: getEventTypeColor(eventType)
    }));
  };

  // Handle user assignment
  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: prev?.assigned_to?.includes(userId)
        ? prev?.assigned_to?.filter(id => id !== userId)
        : [...prev?.assigned_to, userId]
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData?.title?.trim()) {
      errors.title = 'Título requerido';
    }
    
    if (!formData?.start_time) {
      errors.start_time = 'Hora de inicio requerida';
    }
    
    if (!formData?.end_time) {
      errors.end_time = 'Hora de fin requerida';
    }
    
    if (formData?.start_time && formData?.end_time && !formData?.all_day) {
      const start = new Date(formData?.start_time);
      const end = new Date(formData?.end_time);
      if (end <= start) {
        errors.end_time = 'La hora de fin debe ser posterior al inicio';
      }
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
        created_by: user?.id,
        ...(editingEvent ? {} : { created_by: user?.id })
      };

      let result;
      if (editingEvent && editingEvent?.id) {
        result = await calendarService?.updateEvent(editingEvent?.id, submitData);
      } else {
        result = await calendarService?.createEvent(submitData);
      }

      if (result?.error) {
        setError(`Error: ${result?.error?.message}`);
        return;
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

  if (!isOpen) return null;

  // Event type options
  const eventTypeOptions = [
    { value: 'lot_emission', label: 'Emisión de Lote', color: '#3B82F6' },
    { value: 'maintenance', label: 'Mantenimiento', color: '#F59E0B' },
    { value: 'training', label: 'Capacitación', color: '#10B981' },
    { value: 'audit', label: 'Auditoría', color: '#8B5CF6' }
  ];

  // Color options
  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingEvent?.id ? 'Editar Evento' : 'Nuevo Evento'}
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
                  {editingEvent?.id ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente'}
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
            <div className="grid grid-cols-1 gap-4">
              {/* Title */}
              <Input
                label="Título *"
                name="title"
                value={formData?.title}
                onChange={handleInputChange}
                placeholder="Nombre del evento"
                required
                disabled={loading}
              />

              {/* Event Type */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tipo de Evento *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {eventTypeOptions?.map(option => (
                    <div
                      key={option?.value}
                      className={`
                        p-3 border rounded-lg cursor-pointer transition-colors
                        ${formData?.event_type === option?.value
                          ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                        }
                      `}
                      onClick={() => handleEventTypeChange(option?.value)}
                    >
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: option?.color }}
                        />
                        <span className="text-sm font-medium">{option?.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Inicio *"
                  name="start_time"
                  type={formData?.all_day ? "date" : "datetime-local"}
                  value={formData?.start_time}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />

                <Input
                  label="Fin *"
                  name="end_time"
                  type={formData?.all_day ? "date" : "datetime-local"}
                  value={formData?.end_time}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              {/* All Day Toggle */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="all_day"
                  name="all_day"
                  checked={formData?.all_day}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="all_day" className="text-sm font-medium text-foreground">
                  Todo el día
                </label>
              </div>

              {/* Location */}
              <Input
                label="Ubicación"
                name="location"
                value={formData?.location}
                onChange={handleInputChange}
                placeholder="Ubicación del evento"
                disabled={loading}
              />

              {/* Lot Schedule (only for lot emission events) */}
              {formData?.event_type === 'lot_emission' && lotSchedules?.length > 0 && (
                <Select
                  label="Lote Relacionado"
                  name="lot_schedule_id"
                  value={formData?.lot_schedule_id}
                  onChange={(value) => setFormData(prev => ({ ...prev, lot_schedule_id: value }))}
                  disabled={loading}
                >
                  <option value="">Sin relación a lote...</option>
                  {lotSchedules?.map(lot => (
                    <option key={lot?.id} value={lot?.id}>
                      {lot?.lot_number} - {lot?.product?.product_name}
                    </option>
                  ))}
                </Select>
              )}

              {/* Color Picker */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  {colorOptions?.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`
                        w-8 h-8 rounded border-2 transition-transform
                        ${formData?.color === color ? 'border-foreground scale-110' : 'border-border hover:scale-105'}
                      `}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {/* Assigned Users */}
              {users?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Asignar a Usuarios
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {users?.map(user => (
                      <div
                        key={user?.id}
                        className={`
                          p-2 border rounded cursor-pointer transition-colors text-sm
                          ${formData?.assigned_to?.includes(user?.id)
                            ? 'border-primary bg-primary/10' :'border-border hover:border-primary/50'
                          }
                        `}
                        onClick={() => handleUserToggle(user?.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={formData?.assigned_to?.includes(user?.id) ? 'CheckSquare' : 'Square'} 
                            size={14} 
                            className={formData?.assigned_to?.includes(user?.id) ? 'text-primary' : 'text-muted-foreground'} 
                          />
                          <span>{user?.full_name}</span>
                          <span className="text-xs text-muted-foreground">({user?.role})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData?.description}
                  onChange={handleInputChange}
                  placeholder="Descripción del evento..."
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  disabled={loading}
                />
              </div>
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
                {editingEvent?.id ? 'Actualizar' : 'Crear'} Evento
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;