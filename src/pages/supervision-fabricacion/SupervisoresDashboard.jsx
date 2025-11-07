import React, { useEffect, useState } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "../../components/ui/Sidebar";
import BreadcrumbTrail from "../../components/ui/BreadcrumbTrail";
import { Card, CardContent } from "../../components/ui/Card";
import FabricacionTable from "./components/FabricacionTable";
import AreaStatusCard from "./components/AreaStatusCard";

const SupervisoresDashboard = () => {
  const [lotes, setLotes] = useState([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetch("https://backend-pharmatrix.onrender.com/api/pharmatrix/lote")
      .then(res => res.json())
      .then(data => setLotes(data))
      .catch(err => console.error("Error al cargar los lotes:", err));
  }, []);

  const handleSidebarToggle = () => setIsSidebarCollapsed(!isSidebarCollapsed);

  // Agrupar por área de fabricación
  const lotesPorArea = Object.entries(
    lotes.reduce((acc, l) => {
      if (!l.areaFabricacion) return acc;
      acc[l.areaFabricacion] = (acc[l.areaFabricacion] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />

      <main className={`pt-16 transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72"}`}>
        <div className="p-6 space-y-6">
          <BreadcrumbTrail />

          <h1 className="text-2xl font-bold text-foreground">Supervisión de Fabricación</h1>
          <p className="text-muted-foreground">
            Control y monitoreo de áreas y procesos de fabricación de lotes.
          </p>

          {/* Tarjetas resumen por área */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lotesPorArea.map((area, idx) => (
              <AreaStatusCard key={idx} area={area.name} cantidad={area.count} />
            ))}
          </div>

          {/* Tabla principal de control */}
          <Card>
            <CardContent>
              <FabricacionTable lotes={lotes} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SupervisoresDashboard;
