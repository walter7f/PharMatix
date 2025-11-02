import React, { useState } from 'react';

const CalendarView = ({ 
  view, 
  currentDate, 
  lotSchedules = [], 
  onSelectDate,
  onCreateEvent,
  onEditItem
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get week data (starting on Monday)
  const getWeekData = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(date.getDate() + offset);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Get unique production areas/stations
  const getProductionStations = () => {
    // Siempre retornar todas las estaciones de trabajo
    return [
      'PREPARACION',
      'LLENADO LIQUIDOS',
      'LLENADO SEMISOLIDOS',
      'GRANULACION',
      'MEZCLADO',
      'LLENADO POLVOS',
      'ENCAPSULADO',
      'COMPRESION',
      'RECUBRIMIENTO',
      'BLISTER'
    ];
  };

  // Get lots for specific date and station
  const getLotsForDateAndStation = (date, station) => {
    const dateStr = date.toDateString();
    
    return lotSchedules.filter(lot => {
      // Si el lote no tiene fecha, usar la fecha actual
      const lotDate = lot.fecha ? new Date(lot.fecha) : new Date();
      
      // Si el lote no tiene estación, asignar PREPARACION por defecto
      const lotStation = lot.production_station || 'PREPARACION';
      
      const matchesStation = lotStation === station;
      const matchesDate = lotDate.toDateString() === dateStr;
      
      return matchesStation && matchesDate;
    });
  };

  // Status colors
  const getStatusColor = (status) => {
    const colors = {
      planned: 'bg-blue-100 border-blue-300 text-blue-900',
      in_progress: 'bg-orange-100 border-orange-300 text-orange-900', 
      completed: 'bg-green-100 border-green-300 text-green-900',
      cancelled: 'bg-red-100 border-red-300 text-red-900',
      on_hold: 'bg-yellow-100 border-yellow-300 text-yellow-900'
    };
    return colors[status] || 'bg-gray-100 border-gray-300 text-gray-900';
  };

  // Render production grid
  const renderProductionGrid = () => {
    const weekDays = getWeekData(currentDate);
    const stations = getProductionStations();
    const today = new Date();

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="border border-border p-3 text-left font-semibold sticky left-0 bg-primary z-10 min-w-[180px]">
                ESTACIÓN DE TRABAJO
              </th>
              {weekDays.map((date, index) => {
                const isToday = date.toDateString() === today.toDateString();
                return (
                  <th 
                    key={index} 
                    className={`border border-border p-3 text-center min-w-[200px] ${
                      isToday ? 'bg-primary-foreground text-primary font-bold' : ''
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs uppercase">
                        {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                      </span>
                      <span className="text-lg font-bold">
                        {date.getDate()}
                      </span>
                      <span className="text-xs">
                        {date.toLocaleDateString('es-ES', { month: 'short' })}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {stations.map((station, stationIndex) => (
              <tr key={station} className={stationIndex % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                <td className="border border-border p-3 font-semibold text-sm sticky left-0 bg-card z-10">
                  {station}
                </td>
                {weekDays.map((date, dayIndex) => {
                  const lots = getLotsForDateAndStation(date, station);
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <td 
                      key={dayIndex}
                      className={`border border-border p-2 align-top ${
                        isToday ? 'bg-primary/5' : ''
                      }`}
                      onDoubleClick={() => {
                        onCreateEvent?.({
                          fecha: date.toISOString(),
                          production_station: station
                        });
                      }}
                    >
                      <div className="space-y-2 min-h-[80px]">
                        {lots.length === 0 ? (
                          <div className="text-center text-muted-foreground text-xs py-4">
                            Sin programación
                          </div>
                        ) : (
                          lots.map((lot, idx) => (
                            <div
                              key={lot._id || idx}
                              className={`
                                p-2 rounded-md border-2 cursor-pointer
                                hover:shadow-md transition-shadow
                                ${getStatusColor(lot.status || 'planned')}
                              `}
                              onClick={() => onEditItem?.(lot, 'lot')}
                            >
                              <div className="font-bold text-sm mb-1">
                                {lot.producto || 'Producto sin nombre'}
                              </div>
                              <div className="text-xs font-medium mb-1">
                                {lot.tamanioLote || 'Sin tamaño'}
                              </div>
                              {lot.distribucion1 && (
                                <div className="text-xs text-muted-foreground">
                                  D1: {lot.distribucion1}
                                </div>
                              )}
                              {lot.distribucion2 && (
                                <div className="text-xs text-muted-foreground">
                                  D2: {lot.distribucion2}
                                </div>
                              )}
                              {lot.distribucion3 && (
                                <div className="text-xs text-muted-foreground">
                                  D3: {lot.distribucion3}
                                </div>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    
    const firstDayOfWeek = firstDay.getDay();
    const offset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
    startDate.setDate(startDate.getDate() + offset);
    
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    const today = new Date();
    const currentMonth = currentDate.getMonth();

    return (
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-bold text-foreground bg-muted">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            const dayLots = lotSchedules.filter(lot => {
              // Si el lote no tiene fecha, usar la fecha actual
              const lotDate = lot.fecha ? new Date(lot.fecha) : new Date();
              return lotDate.toDateString() === date.toDateString();
            });

            return (
              <div
                key={index}
                className={`
                  min-h-[120px] p-2 border border-border cursor-pointer transition-colors
                  ${isCurrentMonth ? 'bg-background hover:bg-muted/50' : 'bg-muted/20 text-muted-foreground'}
                  ${isSelected ? 'bg-primary/10 border-primary' : ''}
                  ${isToday ? 'ring-2 ring-primary' : ''}
                `}
                onClick={() => {
                  setSelectedDate(date);
                  onSelectDate?.(date);
                }}
                onDoubleClick={() => {
                  onCreateEvent?.({
                    fecha: date.toISOString()
                  });
                }}
              >
                <div className={`text-sm font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayLots.slice(0, 2).map((lot, idx) => (
                    <div
                      key={idx}
                      className="text-xs p-1 rounded cursor-pointer truncate border-l-2 bg-blue-100 border-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem?.(lot, 'lot');
                      }}
                      title={lot.producto}
                    >
                      <div className="font-semibold">{lot.producto}</div>
                      <div className="text-xs">{lot.tamanioLote}</div>
                    </div>
                  ))}
                  
                  {dayLots.length > 2 && (
                    <div className="text-xs text-muted-foreground font-medium">
                      +{dayLots.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render day view
  const renderDayView = () => {
    const dayLots = lotSchedules.filter(lot => {
      // Si el lote no tiene fecha, usar la fecha actual
      const lotDate = lot.fecha ? new Date(lot.fecha) : new Date();
      return lotDate.toDateString() === currentDate.toDateString();
    });

    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();

    return (
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Lotes Programados ({dayLots.length})
          </h3>
          
          {dayLots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay lotes programados para este día
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dayLots.map((lot, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onEditItem?.(lot, 'lot')}
                >
                  <div className="font-bold text-lg mb-2">{lot.producto}</div>
                  <div className="text-sm mb-2">Tamaño: {lot.tamanioLote}</div>
                  {lot.distribucion1 && (
                    <div className="text-sm">Dist. 1: {lot.distribucion1}</div>
                  )}
                  {lot.distribucion2 && (
                    <div className="text-sm">Dist. 2: {lot.distribucion2}</div>
                  )}
                  {lot.distribucion3 && (
                    <div className="text-sm">Dist. 3: {lot.distribucion3}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderProductionGrid();
      case 'day':
        return renderDayView();
      default:
        return renderProductionGrid();
    }
  };

  return (
    <div className="bg-background">
      {renderView()}
    </div>
  );
};

export { CalendarView };