import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../../../components/ui/Card.jsx";
import { Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";

const COLORS = ["#0EA5E9", "#10B981", "#F59E0B", "#EF4444", "#6366F1"];

const BatchAnalysis = () => {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-pharmatrix.onrender.com/api/pharmatrix/lote")
      .then(res => res.json())
      .then(data => {
        setLotes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al obtener los lotes:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  // 🔹 Agrupar por planta
  const lotesPorPlanta = Object.entries(
    lotes.reduce((acc, l) => {
      acc[l.planta] = (acc[l.planta] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 🔹 Agrupar por área de fabricación
  const lotesPorArea = Object.entries(
    lotes.reduce((acc, l) => {
      acc[l.areaFabricacion] = (acc[l.areaFabricacion] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 🔹 Lotes próximos a vencer (menos de 90 días)
  const proximosVencer = lotes.filter(l => {
    const venc = new Date(l.vencimiento);
    const hoy = new Date();
    const diff = (venc - hoy) / (1000 * 60 * 60 * 24);
    return diff > 0 && diff <= 90;
  });

  // 🔹 Tamaño promedio
  const tamanioPromedio =
    lotes.reduce((acc, l) => acc + Number(l.tamanioLote || 0), 0) / lotes.length || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lotes por planta */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Distribución por Planta</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={lotesPorPlanta}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
              >
                {lotesPorPlanta.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lotes por área */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Lotes por Área de Fabricación</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={lotesPorArea}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resumen de estado */}
      <Card className="lg:col-span-2">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Resumen de Estado de Lotes</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">Total de Lotes</p>
              <p className="text-2xl font-bold">{lotes.length}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">Próximos a Vencer</p>
              <p className="text-2xl font-bold">{proximosVencer.length}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">Promedio Tamaño de Lote</p>
              <p className="text-2xl font-bold">{tamanioPromedio.toFixed(2)} {lotes[0]?.unidad || ''}</p>
            </div>
            <div className="p-4 bg-red-50 rounded-xl text-center">
              <p className="text-sm text-muted-foreground">Productos Distintos</p>
              <p className="text-2xl font-bold">{new Set(lotes.map(l => l.producto)).size}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchAnalysis;
