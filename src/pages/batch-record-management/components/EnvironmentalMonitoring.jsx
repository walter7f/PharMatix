import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const EnvironmentalMonitoring = ({ environmentalData, onDataUpdate }) => {
  const [selectedParameter, setSelectedParameter] = useState('temperature');
  const [timeRange, setTimeRange] = useState('24h');

  const parameters = [
    { id: 'temperature', name: 'Temperatura', unit: '°C', icon: 'Thermometer', color: '#DC2626' },
    { id: 'humidity', name: 'Humedad', unit: '%RH', icon: 'Droplets', color: '#2563EB' },
    { id: 'pressure', name: 'Presión', unit: 'Pa', icon: 'Gauge', color: '#059669' },
    { id: 'airflow', name: 'Flujo de Aire', unit: 'm³/h', icon: 'Wind', color: '#D97706' }
  ];

  const getCurrentParameter = () => {
    return parameters?.find(p => p?.id === selectedParameter);
  };

  const getParameterData = () => {
    return environmentalData?.[selectedParameter] || [];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'normal':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAlarmCount = (parameter) => {
    const data = environmentalData?.[parameter] || [];
    return data?.filter(d => d?.status !== 'normal')?.length;
  };

  const currentParam = getCurrentParameter();
  const chartData = getParameterData();
  const latestReading = chartData?.[chartData?.length - 1];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Monitoreo Ambiental</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Control continuo de condiciones ambientales críticas
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-md text-sm text-foreground bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="1h">Última hora</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-6">
        {/* Parameter Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {parameters?.map((param) => (
            <button
              key={param?.id}
              onClick={() => setSelectedParameter(param?.id)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                selectedParameter === param?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon 
                  name={param?.icon} 
                  size={20} 
                  className={selectedParameter === param?.id ? 'text-primary' : 'text-muted-foreground'}
                />
                {getAlarmCount(param?.id) > 0 && (
                  <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full">
                    {getAlarmCount(param?.id)}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground text-left">
                {param?.name}
              </p>
              <p className="text-xs text-muted-foreground text-left">
                {param?.unit}
              </p>
            </button>
          ))}
        </div>

        {/* Current Reading */}
        {latestReading && (
          <div className="bg-muted rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${currentParam?.color}20` }}>
                  <Icon name={currentParam?.icon} size={24} style={{ color: currentParam?.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {currentParam?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Lectura actual
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-foreground">
                  {latestReading?.value}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentParam?.unit}
                </p>
                <p className={`text-sm font-medium ${getStatusColor(latestReading?.status)}`}>
                  {latestReading?.status === 'normal' ? 'Normal' :
                   latestReading?.status === 'warning' ? 'Advertencia' :
                   latestReading?.status === 'critical' ? 'Crítico' : latestReading?.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="bg-muted rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              Tendencia - {currentParam?.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-muted-foreground">Normal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <span className="text-muted-foreground">Advertencia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <span className="text-muted-foreground">Crítico</span>
              </div>
            </div>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#64748B"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748B"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <ReferenceLine 
                  y={latestReading?.upperLimit} 
                  stroke="#DC2626" 
                  strokeDasharray="5 5"
                  label="Límite Superior"
                />
                <ReferenceLine 
                  y={latestReading?.lowerLimit} 
                  stroke="#DC2626" 
                  strokeDasharray="5 5"
                  label="Límite Inferior"
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={currentParam?.color}
                  strokeWidth={2}
                  dot={{ fill: currentParam?.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: currentParam?.color, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alarms and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Alarmas Activas
            </h3>
            <div className="space-y-3">
              {environmentalData?.alarms?.filter(alarm => alarm?.active)?.map((alarm) => (
                <div key={alarm?.id} className="flex items-start space-x-3 p-4 bg-error/10 border border-error/20 rounded-lg">
                  <Icon name="AlertTriangle" size={16} className="text-error mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {alarm?.parameter} - {alarm?.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {alarm?.timestamp} | Sensor: {alarm?.sensorId}
                    </p>
                  </div>
                  <button className="text-error hover:text-error/80 transition-colors">
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
              
              {(!environmentalData?.alarms?.filter(alarm => alarm?.active)?.length) && (
                <div className="text-center py-8">
                  <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No hay alarmas activas
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Eventos Recientes
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {environmentalData?.events?.map((event) => (
                <div key={event?.id} className="flex items-start space-x-3 p-3 bg-muted rounded-lg">
                  <Icon 
                    name={event?.type === 'calibration' ? 'Settings' : 
                          event?.type === 'maintenance' ? 'Wrench' : 'Info'} 
                    size={16} 
                    className="text-muted-foreground mt-0.5" 
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      {event?.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {event?.timestamp} | {event?.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalMonitoring;