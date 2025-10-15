import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const HistoricalDataPanel = ({ batchNumber, historicalData, trendData }) => {
  const [activeTab, setActiveTab] = useState('trends');
  const [selectedParameter, setSelectedParameter] = useState('pH');

  const tabs = [
    { id: 'trends', label: 'Tendencias', icon: 'TrendingUp' },
    { id: 'comparison', label: 'Comparación', icon: 'BarChart3' },
    { id: 'statistics', label: 'Estadísticas', icon: 'PieChart' }
  ];

  const parameters = [
    { id: 'pH', label: 'pH', unit: 'pH' },
    { id: 'moisture', label: 'Humedad', unit: '%' },
    { id: 'assay', label: 'Valoración', unit: '%' },
    { id: 'dissolution', label: 'Disolución', unit: '%' }
  ];

  const getParameterData = (paramId) => {
    return trendData?.filter(item => item?.parameter === paramId);
  };

  const calculateStatistics = (data) => {
    if (!data?.length) return null;
    
    const values = data?.map(item => item?.value);
    const mean = values?.reduce((sum, val) => sum + val, 0) / values?.length;
    const variance = values?.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values?.length;
    const stdDev = Math.sqrt(variance);
    
    return {
      mean: mean?.toFixed(2),
      stdDev: stdDev?.toFixed(2),
      min: Math.min(...values)?.toFixed(2),
      max: Math.max(...values)?.toFixed(2),
      count: values?.length
    };
  };

  const renderTrendsTab = () => {
    const parameterData = getParameterData(selectedParameter);
    const stats = calculateStatistics(parameterData);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Análisis de Tendencias</span>
          </div>
          
          <select
            value={selectedParameter}
            onChange={(e) => setSelectedParameter(e?.target?.value)}
            className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground"
          >
            {parameters?.map(param => (
              <option key={param?.id} value={param?.id}>{param?.label}</option>
            ))}
          </select>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={parameterData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="batchNumber" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="var(--color-primary)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Media</p>
              <p className="text-sm font-semibold text-foreground">{stats?.mean}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Desv. Est.</p>
              <p className="text-sm font-semibold text-foreground">{stats?.stdDev}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Mínimo</p>
              <p className="text-sm font-semibold text-foreground">{stats?.min}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Máximo</p>
              <p className="text-sm font-semibold text-foreground">{stats?.max}</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">Muestras</p>
              <p className="text-sm font-semibold text-foreground">{stats?.count}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderComparisonTab = () => {
    const comparisonData = historicalData?.slice(-6)?.map(batch => ({
      batchNumber: batch?.batchNumber,
      passRate: ((batch?.testsCompleted - batch?.deviations) / batch?.testsCompleted * 100)?.toFixed(1),
      testsCompleted: batch?.testsCompleted,
      deviations: batch?.deviations
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="BarChart3" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Comparación de Lotes Recientes</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="batchNumber" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-popover)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px'
                }}
              />
              <Bar 
                dataKey="passRate" 
                fill="var(--color-success)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisonData?.slice(-3)?.map((batch, index) => (
            <div key={batch?.batchNumber} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{batch?.batchNumber}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  parseFloat(batch?.passRate) >= 95 ? 'bg-success/10 text-success' : 
                  parseFloat(batch?.passRate) >= 90 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'
                }`}>
                  {batch?.passRate}%
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Pruebas:</span>
                  <span>{batch?.testsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Desviaciones:</span>
                  <span>{batch?.deviations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStatisticsTab = () => {
    const overallStats = {
      totalBatches: historicalData?.length,
      averagePassRate: (historicalData?.reduce((sum, batch) => 
        sum + ((batch?.testsCompleted - batch?.deviations) / batch?.testsCompleted * 100), 0
      ) / historicalData?.length)?.toFixed(1),
      totalDeviations: historicalData?.reduce((sum, batch) => sum + batch?.deviations, 0),
      mostCommonIssue: 'Variación en disolución'
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Icon name="PieChart" size={16} className="text-primary" />
          <span className="text-sm font-medium text-foreground">Estadísticas Generales</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <Icon name="Package" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{overallStats?.totalBatches}</p>
            <p className="text-xs text-muted-foreground">Lotes Analizados</p>
          </div>
          
          <div className="bg-success/10 rounded-lg p-4 text-center">
            <Icon name="CheckCircle" size={24} className="text-success mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{overallStats?.averagePassRate}%</p>
            <p className="text-xs text-muted-foreground">Tasa de Aprobación</p>
          </div>
          
          <div className="bg-warning/10 rounded-lg p-4 text-center">
            <Icon name="AlertTriangle" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{overallStats?.totalDeviations}</p>
            <p className="text-xs text-muted-foreground">Total Desviaciones</p>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4 text-center">
            <Icon name="TrendingDown" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-xs font-medium text-foreground text-center leading-tight">
              {overallStats?.mostCommonIssue}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Problema Frecuente</p>
          </div>
        </div>
        <div className="bg-muted/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-foreground mb-3">Resumen de Rendimiento</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lotes con 100% conformidad:</span>
              <span className="font-medium text-foreground">
                {historicalData?.filter(batch => batch?.deviations === 0)?.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Promedio de pruebas por lote:</span>
              <span className="font-medium text-foreground">
                {(historicalData?.reduce((sum, batch) => sum + batch?.testsCompleted, 0) / historicalData?.length)?.toFixed(0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tiempo promedio de validación:</span>
              <span className="font-medium text-foreground">2.3 días</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Datos Históricos y Análisis</h3>
        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab?.id 
                  ? 'bg-background text-foreground shadow-sm' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-[300px]">
        {activeTab === 'trends' && renderTrendsTab()}
        {activeTab === 'comparison' && renderComparisonTab()}
        {activeTab === 'statistics' && renderStatisticsTab()}
      </div>
    </div>
  );
};

export default HistoricalDataPanel;