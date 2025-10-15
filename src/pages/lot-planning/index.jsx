import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import CalendarView from './components/CalendarView';
import LotModal from './components/LotModal';
import EventModal from './components/EventModal';
import { lotScheduleService, calendarService, subscriptionService } from '../../services/planningService';
import Icon from '../../components/AppIcon';

const LotPlanningPage = () => {
  const { user, userProfile } = useAuth();
  
  // Data states
  const [lotSchedules, setLotSchedules] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showLotModal, setShowLotModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Calendar states
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignedTo: 'all',
    eventType: 'all'
  });

  // Calculate date range for current view
  const dateRange = useMemo(() => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    switch (currentView) {
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1, 0);
        break;
      case 'week':
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        end.setDate(start.getDate() + 6);
        break;
      case 'day':
        end.setDate(start.getDate());
        break;
      default:
        break;
    }
    
    return { start: start.toISOString(), end: end.toISOString() };
  }, [currentView, currentDate]);

  // Load data
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [lotResult, eventsResult] = await Promise.all([
        lotScheduleService.getLotsInRange(dateRange.start, dateRange.end),
        calendarService.getEvents(dateRange.start, dateRange.end)
      ]);

      if (lotResult?.error) {
        setError(`Error loading lot schedules: ${lotResult.error.message}`);
        return;
      }
      
      if (eventsResult?.error) {
        setError(`Error loading calendar events: ${eventsResult.error.message}`);
        return;
      }

      setLotSchedules(lotResult?.data || []);
      setCalendarEvents(eventsResult?.data || []);
    } catch (error) {
      setError(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, dateRange]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const unsubscribeLots = subscriptionService.subscribeLotSchedules(() => {
      loadData();
    });

    const unsubscribeEvents = subscriptionService.subscribeCalendarEvents(() => {
      loadData();
    });

    return () => {
      unsubscribeLots();
      unsubscribeEvents();
    };
  }, [user]);

  // Filter data
  const filteredData = useMemo(() => {
    const filterLots = (lots) => {
      return lots?.filter(lot => {
        if (filters.status !== 'all' && lot.status !== filters.status) return false;
        if (filters.priority !== 'all' && lot.priority !== filters.priority) return false;
        if (filters.assignedTo !== 'all' && lot.assigned_to !== filters.assignedTo) return false;
        return true;
      }) || [];
    };

    const filterEvents = (events) => {
      return events?.filter(event => {
        if (filters.eventType !== 'all' && event.event_type !== filters.eventType) return false;
        return true;
      }) || [];
    };

    return {
      lots: filterLots(lotSchedules),
      events: filterEvents(calendarEvents)
    };
  }, [lotSchedules, calendarEvents, filters]);

  // Handle create new lot
  const handleCreateLot = () => {
    setEditingItem(null);
    setShowLotModal(true);
  };

  // Handle create new event
  const handleCreateEvent = (dateInfo = null) => {
    setEditingItem(dateInfo ? { ...dateInfo } : null);
    setShowEventModal(true);
  };

  // Handle edit item
  const handleEditItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'lot') {
      setShowLotModal(true);
    } else {
      setShowEventModal(true);
    }
  };

  // Handle item saved
  const handleItemSaved = () => {
    loadData();
    setShowLotModal(false);
    setShowEventModal(false);
    setEditingItem(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowLotModal(false);
    setShowEventModal(false);
    setEditingItem(null);
  };

  // Handle date navigation
  const handleDateNavigation = (direction) => {
    const newDate = new Date(currentDate);
    
    switch (currentView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + direction);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction * 7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + direction);
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
  };

  // Handle view change
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  // Check user permissions
  const canCreateLots = userProfile?.role && ['admin', 'production_manager', 'quality_manager'].includes(userProfile.role);
  const canManageEvents = !!user;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando calendario de lotes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header simplificado */}
      <div className="bg-card border-b border-border shadow-sm z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-foreground">
                Planificación de Lotes
              </h1>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateNavigation(-1)}
                  iconName="ChevronLeft"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDateNavigation(1)}
                  iconName="ChevronRight"
                  iconPosition="right"
                />
              </div>

              <h2 className="text-lg text-muted-foreground">
                {currentDate.toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long',
                  ...(currentView === 'day' && { day: 'numeric' })
                })}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                {['month', 'week', 'day'].map(view => (
                  <Button
                    key={view}
                    variant={currentView === view ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => handleViewChange(view)}
                    className="px-3 py-1 text-xs capitalize"
                  >
                    {view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día'}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
              {canManageEvents && (
                <Button
                  variant="outline"
                  onClick={() => handleCreateEvent()}
                  iconName="Plus"
                >
                  Evento
                </Button>
              )}
              
              {canCreateLots && (
                <Button
                  onClick={handleCreateLot}
                  iconName="Plus"
                >
                  Nuevo Lote
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Calendario a pantalla completa */}
      <div className="flex-1 flex flex-col">
        
        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error font-medium">Error</p>
            </div>
            <p className="text-sm text-error mt-1">{error}</p>
          </div>
        )}

        {/* Calendar Component - Ocupa todo el espacio disponible */}
        <div className="flex-1 p-6">
          <div className="bg-card rounded-lg shadow-sm border border-border h-full">
            <CalendarView
              view={currentView}
              currentDate={currentDate}
              lotSchedules={filteredData.lots || []}
              calendarEvents={filteredData.events || []}
              onSelectDate={setSelectedDate}
              onCreateEvent={handleCreateEvent}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <LotModal
            isOpen={showLotModal}
            onClose={handleModalClose}
            editingLot={editingItem}
            onSaved={handleItemSaved}
          />
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <EventModal
            isOpen={showEventModal}
            onClose={handleModalClose}
            editingEvent={editingItem}
            onSaved={handleItemSaved}
          />
        </div>
      )}
    </div>
  );
};

export default LotPlanningPage;