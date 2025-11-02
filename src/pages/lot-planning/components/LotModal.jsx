import React, { useState, useEffect } from 'react';

const LotModal = ({ isOpen, onClose, editingLot, onSaved }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    producto: '',
    tamanioLote: '',
    distribucion1: '',
    distribucion2: '',
    distribucion3: '',
    distribucion4: '',
    distribucion5: ''
  });

  // Initialize form
  useEffect(() => {
    if (isOpen) {
      if (editingLot) {
        // Edit mode
        setFormData({
          producto: editingLot?.producto || '',
          tamanioLote: editingLot?.tamanioLote || '',
          distribucion1: editingLot?.distribucion1 || '',
          distribucion2: editingLot?.distribucion2 || '',
          distribucion3: editingLot?.distribucion3 || '',
          distribucion4: editingLot?.distribucion4 || '',
          distribucion5: editingLot?.distribucion5 || ''
        });
      } else {
        // Create mode - reset form
        setFormData({
          producto: '',
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
  }, [isOpen, editingLot]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!formData.producto.trim()) {
      errors.push('Producto es requerido');
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
      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/lote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
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
                  Lote creado exitosamente
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
