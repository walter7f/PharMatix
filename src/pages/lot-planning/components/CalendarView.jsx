import React, { useState, useMemo } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CalendarView = ({ 
  view, 
  currentDate, 
  lotSchedules = [], 
  calendarEvents = [], 
  onSelectDate,
  onCreateEvent,
  onEditItem
}) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Get week data (starting on Monday)
  const getWeekData = (date) => {
    const startOfWeek = new Date(date);
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const dayOfWeek = startOfWeek.getDay();
    // Calculate offset to get to Monday (if Sunday, go back 6 days, otherwise go back dayOfWeek - 1)
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
    const stations = new Set();
    lotSchedules.forEach(lot => {
      if (lot.production_station) {
        stations.add(lot.production_station);
      }
    });
    
    // Default stations if none found
    if (stations.size === 0) {
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
    }
    
    return Array.from(stations).sort();
  };

  // Get lots for specific date and station
  const getLotsForDateAndStation = (date, station) => {
    const dateStr = date.toDateString();
    
    return lotSchedules.filter(lot => {
      const startDate = new Date(lot.scheduled_start);
      const endDate = new Date(lot.scheduled_end);
      const matchesStation = lot.production_station === station;
      const matchesDate = startDate.toDateString() === dateStr || 
                         (startDate <= date && endDate >= date);
      
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

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-500 text-white',
      high: 'bg-orange-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-green-500 text-white'
    };
    return badges[priority] || 'bg-gray-500 text-white';
  };

  // Render production grid (like the PDF)
  const renderProductionGrid = () => {
    const weekDays = getWeekData(currentDate);
    const stations = getProductionStations();
    const today = new Date();

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header with dates */}
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

          {/* Body with stations and lots */}
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
                          start_time: date.toISOString(),
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
                          lots.map(lot => (
                            <div
                              key={lot.id}
                              className={`
                                p-2 rounded-md border-2 cursor-pointer
                                hover:shadow-md transition-shadow
                                ${getStatusColor(lot.status)}
                              `}
                              onClick={() => onEditItem?.(lot, 'lot')}
                            >
                              {/* Lot Number */}
                              <div className="font-bold text-sm mb-1">
                                {lot.lot_number}
                              </div>
                              
                              {/* Product Name */}
                              <div className="text-xs font-semibold mb-1 line-clamp-2">
                                {lot.product?.product_name || 'Producto sin nombre'}
                              </div>
                              
                              {/* Quantity */}
                              <div className="text-xs mb-1">
                                {lot.quantity ? `${lot.quantity.toLocaleString()} unidades` : ''}
                              </div>
                              
                              {/* Priority Badge */}
                              {lot.priority && (
                                <span className={`
                                  inline-block px-2 py-0.5 rounded text-xs font-bold
                                  ${getPriorityBadge(lot.priority)}
                                `}>
                                  {lot.priority === 'urgent' ? 'URGENTE' : lot.priority.toUpperCase()}
                                </span>
                              )}
                              
                              {/* Notes/Legend */}
                              {lot.notes && (
                                <div className="text-xs mt-1 italic text-muted-foreground line-clamp-1">
                                  {lot.notes}
                                </div>
                              )}
                              
                              {/* Due Date if exists */}
                              {lot.scheduled_end && (
                                <div className="text-xs mt-1 font-medium">
                                  Fecha límite: {new Date(lot.scheduled_end).toLocaleDateString('es-ES')}
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

  // Render month view (calendar style)
  const renderMonthView = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Adjust to start on Monday
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
        {/* Month header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-bold text-foreground bg-muted">
              {day}
            </div>
          ))}
        </div>
        
        {/* Month grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === today.toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            const dayLots = lotSchedules.filter(lot => {
              const startDate = new Date(lot.scheduled_start);
              const endDate = new Date(lot.scheduled_end);
              return startDate.toDateString() === date.toDateString() || 
                     (startDate <= date && endDate >= date);
            });
            
            const dayEvents = calendarEvents.filter(event => {
              const eventDate = new Date(event.start_time);
              return eventDate.toDateString() === date.toDateString();
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
                  const startTime = new Date(date);
                  startTime.setHours(8, 0, 0, 0);
                  onCreateEvent?.({
                    start_time: startTime.toISOString()
                  });
                }}
              >
                {/* Date number */}
                <div className={`text-sm font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>
                  {date.getDate()}
                </div>
                
                {/* Lots */}
                <div className="space-y-1">
                  {dayLots.slice(0, 2).map(lot => (
                    <div
                      key={lot.id}
                      className={`
                        text-xs p-1 rounded cursor-pointer truncate border-l-2
                        ${getStatusColor(lot.status)}
                      `}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem?.(lot, 'lot');
                      }}
                      title={`${lot.lot_number} - ${lot.product?.product_name}`}
                    >
                      <div className="font-semibold">{lot.lot_number}</div>
                      <div className="text-xs truncate">{lot.product?.product_name}</div>
                    </div>
                  ))}
                  
                  {/* Events */}
                  {dayEvents.slice(0, 1).map(event => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded cursor-pointer truncate bg-blue-100 border-l-2 border-blue-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem?.(event, 'event');
                      }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  
                  {/* More indicator */}
                  {(dayLots.length + dayEvents.length) > 3 && (
                    <div className="text-xs text-muted-foreground font-medium">
                      +{dayLots.length + dayEvents.length - 3} más
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

  // Render day view (detailed list)
  const renderDayView = () => {
    const dayLots = lotSchedules.filter(lot => {
      const startDate = new Date(lot.scheduled_start);
      const endDate = new Date(lot.scheduled_end);
      return startDate.toDateString() === currentDate.toDateString() || 
             (startDate <= currentDate && endDate >= currentDate);
    });
    
    const dayEvents = calendarEvents.filter(event => {
      const eventDate = new Date(event.start_time);
      return eventDate.toDateString() === currentDate.toDateString();
    });

    const today = new Date();
    const isToday = currentDate.toDateString() === today.toDateString();

    return (
      <div className="p-6">
        {/* Day header */}
        <div className="mb-6 text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isToday ? 'text-primary' : ''}`}>
            {currentDate.toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h2>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateEvent?.({ start_time: currentDate.toISOString() })}
              iconName="Plus"
            >
              Crear Evento
            </Button>
            <Button
              size="sm"
              onClick={() => onEditItem?.(null, 'lot')}
              iconName="Plus"
            >
              Nuevo Lote
            </Button>
          </div>
        </div>

        {/* Lots section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Icon name="Package" size={20} className="mr-2" />
            Lotes Programados ({dayLots.length})
          </h3>
          
          {dayLots.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay lotes programados para este día
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {dayLots.map(lot => (
                <div
                  key={lot.id}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer
                    hover:shadow-lg transition-shadow
                    ${getStatusColor(lot.status)}
                  `}
                  onClick={() => onEditItem?.(lot, 'lot')}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-lg">{lot.lot_number}</div>
                    {lot.priority && (
                      <span className={`
                        px-2 py-1 rounded text-xs font-bold
                        ${getPriorityBadge(lot.priority)}
                      `}>
                        {lot.priority.toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="font-semibold mb-2">
                    {lot.product?.product_name}
                  </div>
                  
                  {lot.quantity && (
                    <div className="text-sm mb-2">
                      Cantidad: {lot.quantity.toLocaleString()} unidades
                    </div>
                  )}
                  
                  {lot.production_station && (
                    <div className="text-sm mb-2">
                      Estación: {lot.production_station}
                    </div>
                  )}
                  
                  {lot.notes && (
                    <div className="text-sm italic text-muted-foreground mt-2">
                      {lot.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Events section */}
        {dayEvents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Icon name="Calendar" size={20} className="mr-2" />
              Eventos ({dayEvents.length})
            </h3>
            
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  className="p-4 rounded-lg border-2 border-blue-300 bg-blue-50 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onEditItem?.(event, 'event')}
                >
                  <div className="font-bold mb-1">{event.title}</div>
                  {event.description && (
                    <div className="text-sm text-muted-foreground">{event.description}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {new Date(event.start_time).toLocaleTimeString('es-ES', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render appropriate view
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

export default CalendarView;