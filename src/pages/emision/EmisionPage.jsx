import React, { useState, useEffect } from 'react';
import { RefreshCw, Edit2, X, Check, Zap, Save } from 'lucide-react';

function EmisionPage() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [lotesTemporales, setLotesTemporales] = useState({});
  const [hayLotesTemporales, setHayLotesTemporales] = useState(false);

  const meses = [
    { value: 'A', label: 'Enero', codigo: 'A' },
    { value: 'Febrero', label: 'Febrero', codigo: '2' },
    { value: 'Marzo', label: 'Marzo', codigo: '3' },
    { value: 'Abril', label: 'Abril', codigo: '4' },
    { value: 'Mayo', label: 'Mayo', codigo: '5' },
    { value: 'Junio', label: 'Junio', codigo: '6' },
    { value: 'Julio', label: 'Julio', codigo: '7' },
    { value: 'Agosto', label: 'Agosto', codigo: '8' },
    { value: 'Septiembre', label: 'Septiembre', codigo: '9' },
    { value: 'Octubre', label: 'Octubre', codigo: 'D' },
    { value: 'Noviembre', label: 'Noviembre', codigo: 'E' },
    { value: 'Diciembre', label: 'Diciembre', codigo: '12' }
  ];

  // Función para generar número de lote basado en mes y correlativo
  const generateLoteNumber = (nombreMes, correlativo) => {
    const year = new Date().getFullYear().toString().slice(-1);
    const mesData = meses.find(m => m.value === nombreMes);
    const mesCode = mesData ? mesData.codigo : '1';
    const corr = String(correlativo).padStart(mesCode === 'A' || mesCode === 'D' || mesCode === 'E' ? 3 : 2, '0');
    
    // Para enero (A), octubre (D) y noviembre (E)
    if (mesCode === 'A' || mesCode === 'D' || mesCode === 'E') {
      return `${mesCode}${corr}${year}`;
    }
    
    // Para los demás meses
    return `${mesCode}${corr}${year}`;
  };

  // Generar lotes temporales para mostrar en la tabla
  const generarLotesTemporales = () => {
    if (!mesSeleccionado) {
      alert('Por favor selecciona un mes primero');
      return;
    }

    const nuevosLotesTemp = {};
    lotes.forEach((lote, index) => {
      const correlativo = index + 1;
      const numeroLote = generateLoteNumber(mesSeleccionado, correlativo);
      nuevosLotesTemp[lote.id] = {
        planificacion: mesSeleccionado,
        lote: numeroLote
      };
    });

    setLotesTemporales(nuevosLotesTemp);
    setHayLotesTemporales(true);
  };

  // Guardar todos los lotes temporales
  const guardarTodosLosLotes = async () => {
    if (!window.confirm(`¿Guardar ${Object.keys(lotesTemporales).length} lotes en la base de datos?`)) {
      return;
    }

    setSaving(true);

    try {
      for (const [id, datos] of Object.entries(lotesTemporales)) {
        const response = await fetch(`https://backend-pharmatrix.onrender.com/api/pharmatrix/upadatePlani/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(datos)
        });

        if (!response.ok) {
          throw new Error(`Error al actualizar lote`);
        }
      }

      await fetchLotes();
      setLotesTemporales({});
      setHayLotesTemporales(false);
      setMesSeleccionado('');
      alert('¡Lotes guardados exitosamente!');
    } catch (err) {
      alert('Error al guardar lotes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Cancelar lotes temporales
  const cancelarLotesTemporales = () => {
    if (window.confirm('¿Descartar los lotes generados sin guardar?')) {
      setLotesTemporales({});
      setHayLotesTemporales(false);
      setMesSeleccionado('');
    }
  };

  // Editar un lote temporal específico
  const editarLoteTemporal = (id, campo, valor) => {
    setLotesTemporales(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  // Generar lote automáticamente para un registro individual
  const autoGenerateLote = () => {
    const mes = editData.planificacion || '1';
    const correlativo = Math.floor(Math.random() * 999) + 1;
    setEditData(prev => ({
      ...prev,
      lote: generateLoteNumber(mes, correlativo)
    }));
  };

  // Cargar datos de la API
  const fetchLotes = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/lote');
      if (!response.ok) throw new Error('Error al cargar los datos');
      const data = await response.json();
      setLotes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLotes();
  }, []);

  // Iniciar edición individual
  const startEdit = (lote) => {
    setEditingId(lote.id);
    const loteTemp = lotesTemporales[lote.id];
    setEditData({
      planificacion: loteTemp?.planificacion || lote.planificacion || '',
      vencimiento: lote.vencimiento || '',
      formaFarmaceutica: lote.formaFarmaceutica || '',
      unidad: lote.unidad || '',
      lote: loteTemp?.lote || lote.lote || '',
      orden: lote.orden || '',
      areaFabricacion: lote.areaFabricacion || ''
    });
  };

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  // Guardar cambios individuales
  const saveChanges = async (id) => {
    try {
      setSaving(true);
      const response = await fetch(`https://backend-pharmatrix.onrender.com/api/pharmatrix/upadatePlani/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData)
      });

      if (!response.ok) throw new Error('Error al actualizar');

      await fetchLotes();
      
      // Remover de lotes temporales si existe
      if (lotesTemporales[id]) {
        const nuevosLotesTemp = { ...lotesTemporales };
        delete nuevosLotesTemp[id];
        setLotesTemporales(nuevosLotesTemp);
        setHayLotesTemporales(Object.keys(nuevosLotesTemp).length > 0);
      }
      
      setEditingId(null);
      setEditData({});
    } catch (err) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Formatear fecha para input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Obtener nombre del mes
  const getMesLabel = (value) => {
    const mes = meses.find(m => m.value === value);
    return mes ? mes.label : value;
  };

  // Obtener todas las distribuciones
  const getDistribuciones = (lote) => {
    const distribuciones = [];
    for (let i = 1; i <= 5; i++) {
      const dist = lote[`distribucion${i}`];
      if (dist && dist.trim()) {
        distribuciones.push(dist);
      }
    }
    return distribuciones;
  };

  // Obtener el valor a mostrar (temporal o real)
  const getValorMostrar = (lote, campo) => {
    if (lotesTemporales[lote.id] && lotesTemporales[lote.id][campo]) {
      return lotesTemporales[lote.id][campo];
    }
    return lote[campo];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold mb-2">Error</p>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchLotes}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">Área de Emisión</h1>
            <button
              onClick={fetchLotes}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Actualizar
            </button>
          </div>
          <p className="text-gray-600 mb-4">Gestión de lotes - Pharmatrix</p>
          
          {/* Panel de generación masiva de lotes */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
            <h2 className="text-lg font-bold text-green-800 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generación Automática de Lotes
            </h2>
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona el mes de planificación
                </label>
                <select
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={hayLotesTemporales}
                >
                  <option value="">-- Seleccionar mes --</option>
                  {meses.map((mes) => (
                    <option key={mes.value} value={mes.value}>
                      {mes.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {!hayLotesTemporales ? (
                <button
                  onClick={generarLotesTemporales}
                  disabled={!mesSeleccionado}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition"
                >
                  <Zap className="w-5 h-5" />
                  Generar Vista Previa
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={guardarTodosLosLotes}
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold transition"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Guardar Todos
                      </>
                    )}
                  </button>
                  <button
                    onClick={cancelarLotesTemporales}
                    disabled={saving}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 transition"
                  >
                    <X className="w-5 h-5" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-3">
              {!hayLotesTemporales 
                ? `Esto generará números de lote correlativos para los ${lotes.length} registros en vista previa`
                : `${Object.keys(lotesTemporales).length} lotes generados. Revisa y edita antes de guardar.`
              }
            </p>
          </div>    
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Producto</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tamaño Lote</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Distribuciones</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Planta</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Área Fabricación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Planificación (Mes)</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Vencimiento</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Forma Farmacéutica</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Unidad</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nº Lote</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Orden</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lotes.map((lote) => {
                  const isEditing = editingId === lote.id;
                  const distribuciones = getDistribuciones(lote);
                  const tieneLoteTemporal = !!lotesTemporales[lote.id];
                  const planificacionMostrar = getValorMostrar(lote, 'planificacion');
                  const loteMostrar = getValorMostrar(lote, 'lote');

                  return (
                    <tr key={lote.id} className={`hover:bg-gray-50 ${tieneLoteTemporal ? 'bg-yellow-50' : ''}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {lote.producto}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lote.tamanioLote}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {distribuciones.length > 0 ? (
                          <ul className="list-disc list-inside space-y-1">
                            {distribuciones.map((dist, idx) => (
                              <li key={idx} className="text-xs">{dist}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400">Sin distribuciones</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {lote.planta}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.areaFabricacion}
                            onChange={(e) => setEditData({...editData, areaFabricacion: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        ) : (
                          <span className="font-semibold text-blue-600">
                            {lote.areaFabricacion}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <select
                            value={editData.planificacion}
                            onChange={(e) => setEditData({...editData, planificacion: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="">Seleccionar mes</option>
                            {meses.map((mes) => (
                              <option key={mes.value} value={mes.value}>
                                {mes.label}
                              </option>
                            ))}
                          </select>
                        ) : tieneLoteTemporal && !isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-yellow-700">
                              {getMesLabel(planificacionMostrar)}
                            </span>
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Temporal
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-700 font-medium">
                            {planificacionMostrar ? getMesLabel(planificacionMostrar) : '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="date"
                            value={editData.vencimiento}
                            onChange={(e) => setEditData({...editData, vencimiento: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {lote.vencimiento ? formatDateForInput(lote.vencimiento) : '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.formaFarmaceutica}
                            onChange={(e) => setEditData({...editData, formaFarmaceutica: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                            placeholder="Forma"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {lote.formaFarmaceutica || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.unidad}
                            onChange={(e) => setEditData({...editData, unidad: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                            placeholder="Unidad"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {lote.unidad || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={editData.lote}
                              onChange={(e) => setEditData({...editData, lote: e.target.value})}
                              className="flex-1 px-2 py-1 border rounded text-sm font-mono"
                              placeholder="A0015"
                            />
                            <button
                              onClick={autoGenerateLote}
                              disabled={!editData.planificacion}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-1"
                              title={editData.planificacion ? "Generar lote automático" : "Selecciona un mes primero"}
                            >
                              <Zap className="w-3 h-3" />
                            </button>
                          </div>
                        ) : tieneLoteTemporal && !isEditing ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-base text-yellow-700">
                              {loteMostrar}
                            </span>
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Nuevo
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-900 font-mono font-bold text-base">
                            {loteMostrar || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.orden}
                            onChange={(e) => setEditData({...editData, orden: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                            placeholder="Orden"
                          />
                        ) : (
                          <span className="text-gray-700">
                            {lote.orden || '-'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => saveChanges(lote.id)}
                              disabled={saving}
                              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                              title="Guardar"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={saving}
                              className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(lote)}
                            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {lotes.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No hay lotes disponibles</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmisionPage;