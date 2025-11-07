import React, { useState } from "react";

const ProcesoModal = ({ lote, onClose }) => {
  const [proceso, setProceso] = useState(lote.proceso || "");
  const [estado, setEstado] = useState(lote.estadoProductoTerminado || "");

  const handleSave = async () => {
    try {
      const res = await fetch(`https://backend-pharmatrix.onrender.com/api/pharmatrix/lote/${lote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proceso, estadoProductoTerminado: estado }),
      });
      if (res.ok) {
        alert("Actualizado correctamente");
        onClose();
      } else {
        alert("Error al actualizar el lote");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Editar Proceso de Lote</h2>
        <p className="text-sm text-gray-600 mb-4">
          Lote: <strong>{lote.lote}</strong> ({lote.producto})
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Proceso actual</label>
            <input
              type="text"
              value={proceso}
              onChange={(e) => setProceso(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Estado del producto</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Seleccionar estado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcesoModal;
