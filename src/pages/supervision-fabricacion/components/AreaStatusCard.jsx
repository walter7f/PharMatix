import React from "react";

const colors = ["bg-blue-100", "bg-green-100", "bg-amber-100", "bg-rose-100"];

const AreaStatusCard = ({ area, cantidad }) => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <div className={`p-4 rounded-xl shadow-sm ${color}`}>
      <h3 className="text-sm text-muted-foreground font-medium">Área</h3>
      <p className="text-lg font-semibold">{area || "Sin área"}</p>
      <p className="text-sm mt-1">Lotes activos: <span className="font-bold">{cantidad}</span></p>
    </div>
  );
};

export default AreaStatusCard;
