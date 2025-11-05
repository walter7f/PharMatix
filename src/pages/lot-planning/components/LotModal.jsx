import React, { useState, useEffect } from 'react';

const LotModal = ({ isOpen, onClose, editingLot, onSaved, defaultDate, defaultArea, defaultPlant }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areas, setAreas] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    producto: '',
    fechaPhani: '',
    areaFabricacion: '',
    planta: '',
    tamanioLote: '',
    distribucion1: '',
    distribucion2: '',
    distribucion3: '',
    distribucion4: '',
    distribucion5: ''
  });

  // Load areas from API
  const loadAreas = async () => {
    setLoadingAreas(true);
    try {
      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/areaf');
      
      if (!response.ok) {
        throw new Error('Error al cargar las áreas de fabricación');
      }
      
      const result = await response.json();
      const areasData = result.data || result || [];
      setAreas(areasData);
    } catch (error) {
      console.error('Error loading areas:', error);
      setError('Error al cargar las áreas de fabricación');
    } finally {
      setLoadingAreas(false);
    }
  };

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      loadAreas();
      
      if (editingLot) {
        // Edit mode
        const lotDate = editingLot.fechaPhani || editingLot.fecha || '';
        let formattedDate = '';
        if (lotDate) {
          const date = new Date(lotDate);
          // Format as YYYY-MM-DD in local timezone
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          formattedDate = `${year}-${month}-${day}`;
        }
        
        setFormData({
          producto: editingLot?.producto || '',
          fechaPhani: formattedDate,
          areaFabricacion: editingLot?.areaFabricacion || editingLot?.production_station || '',
          planta: editingLot?.planta || '',
          tamanioLote: editingLot?.tamanioLote || '',
          distribucion1: editingLot?.distribucion1 || '',
          distribucion2: editingLot?.distribucion2 || '',
          distribucion3: editingLot?.distribucion3 || '',
          distribucion4: editingLot?.distribucion4 || '',
          distribucion5: editingLot?.distribucion5 || ''
        });
      } else {
        // Create mode - use defaults if provided
        let defaultDateFormatted = '';
        if (defaultDate) {
          const date = new Date(defaultDate);
          // Format as YYYY-MM-DD in local timezone
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          defaultDateFormatted = `${year}-${month}-${day}`;
        }
        
        setFormData({
          producto: '',
          fechaPhani: defaultDateFormatted,
          areaFabricacion: defaultArea || '',
          planta: defaultPlant || '',
          tamanioLote: '',
          distribucion1: '',
          distribucion2: '',
          distribucion3: '',
          distribucion4: '',
          distribucion5: ''
        });
      }
      
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, editingLot, defaultDate, defaultArea, defaultPlant]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filter areas by selected plant
  const getFilteredAreas = () => {
    if (!formData.planta) return areas;
    return areas.filter(area => area.Planta === formData.planta);
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!formData.producto.trim()) {
      errors.push('Producto es requerido');
    }
    
    if (!formData.fechaPhani) {
      errors.push('Fecha de planificación es requerida');
    }
    
    if (!formData.areaFabricacion) {
      errors.push('Área de fabricación es requerida');
    }
    
    if (!formData.planta) {
      errors.push('Planta es requerida');
    }
    
    if (!formData.tamanioLote.trim()) {
      errors.push('Tamaño de lote es requerido');
    }

    return errors;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare data to send - convert date to ISO string
      const dataToSend = {
        ...formData,
        // Convert YYYY-MM-DD to ISO string at start of day in local timezone
        fechaPhani: formData.fechaPhani ? new Date(formData.fechaPhani + 'T00:00:00').toISOString() : null
      };

      console.log('Sending data:', dataToSend);

      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/lote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear el lote');
      }

      setSuccess(true);
      setTimeout(() => {
        onSaved?.(result);
        onClose();
      }, 1500);

    } catch (error) {
      setError(error.message || 'Error inesperado al crear el lote');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingLot ? 'Editar Lote' : 'Nuevo Lote'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            disabled={loading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm text-green-600 font-medium">
                  Lote {editingLot ? 'actualizado' : 'creado'} exitosamente
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-error font-medium">Error</p>
              </div>
              <p className="text-sm text-error mt-1">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Producto */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Producto *
                </label>
                <input
                  type="text"
                  name="producto"
                  value={formData.producto}
                  onChange={handleInputChange}
                  placeholder="Ej: Dexketal"
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {/* Fecha de Planificación */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Fecha de Planificación *
                </label>
                <input
                  type="date"
                  name="fechaPhani"
                  value={formData.fechaPhani}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {/* Planta */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Planta *
                </label>
                <select
                  name="planta"
                  value={formData.planta}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading || loadingAreas}
                >
                  <option value="">Seleccione una planta</option>
                  <option value="FARMA">FARMA</option>
                  <option value="BETA">BETA</option>
                </select>
              </div>

              {/* Área de Fabricación */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Área de Fabricación *
                </label>
                <select
                  name="areaFabricacion"
                  value={formData.areaFabricacion}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading || loadingAreas || !formData.planta}
                >
                  <option value="">
                    {!formData.planta ? 'Primero seleccione una planta' : 'Seleccione un área'}
                  </option>
                  {getFilteredAreas().map((area) => (
                    <option key={area.id} value={area.area_nombre}>
                      {area.area_nombre}
                    </option>
                  ))}
                </select>
                {loadingAreas && (
                  <p className="text-xs text-muted-foreground mt-1">Cargando áreas...</p>
                )}
              </div>

              {/* Tamaño de Lote */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Tamaño de Lote *
                </label>
                <input
                  type="text"
                  name="tamanioLote"
                  value={formData.tamanioLote}
                  onChange={handleInputChange}
                  placeholder="Ej: 250 L"
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              {/* Distribuciones */}
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Distribuciones
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Distribución 1 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Distribución 1
                    </label>
                    <input
                      type="text"
                      name="distribucion1"
                      value={formData.distribucion1}
                      onChange={handleInputChange}
                      placeholder="Ej: 10 cj"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {/* Distribución 2 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Distribución 2
                    </label>
                    <input
                      type="text"
                      name="distribucion2"
                      value={formData.distribucion2}
                      onChange={handleInputChange}
                      placeholder="Ej: 8 cj"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {/* Distribución 3 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Distribución 3
                    </label>
                    <input
                      type="text"
                      name="distribucion3"
                      value={formData.distribucion3}
                      onChange={handleInputChange}
                      placeholder="Ej: 9 cj"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {/* Distribución 4 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Distribución 4
                    </label>
                    <input
                      type="text"
                      name="distribucion4"
                      value={formData.distribucion4}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>

                  {/* Distribución 5 */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Distribución 5
                    </label>
                    <input
                      type="text"
                      name="distribucion5"
                      value={formData.distribucion5}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || success}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {loading ? (
                  <span>Guardando...</span>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>{editingLot ? 'Actualizar' : 'Crear'} Lote</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotModal;