import React, { useState } from "react";
import ProcesoModal from "./ProcesoModal.jsx";

const FabricacionTable = ({ lotes }) => {
  const [selectedLote, setSelectedLote] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Lote</th>
            <th className="p-3">Producto</th>
            <th className="p-3">Área</th>
            <th className="p-3">Proceso</th>
            <th className="p-3">Estado</th>
            <th className="p-3 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lotes.map((lote) => (
            <tr key={lote.id} className="border-b hover:bg-gray-50">
              <td className="p-3">{lote.lote}</td>
              <td className="p-3">{lote.producto}</td>
              <td className="p-3">{lote.areaFabricacion || "-"}</td>
              <td className="p-3">{lote.proceso || "No asignado"}</td>
              <td className="p-3">{lote.estadoProductoTerminado || "Pendiente"}</td>
              <td className="p-3 text-center">
                <button
                  onClick={() => setSelectedLote(lote)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedLote && (
        <ProcesoModal lote={selectedLote} onClose={() => setSelectedLote(null)} />
      )}
    </div>
  );
};

export default FabricacionTable;
