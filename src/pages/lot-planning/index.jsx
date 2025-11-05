import React, { useState, useEffect } from 'react';
import { CalendarView } from './components/CalendarView';
import LotModal from './components/LotModal';

const LotPlanningPage = () => {
  // Data states
  const [lotSchedules, setLotSchedules] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedPlant, setSelectedPlant] = useState('FARMA'); // Default to FARMA
  
  // Modal states
  const [showLotModal, setShowLotModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Calendar states
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Load areas from API
  const loadAreas = async () => {
    try {
      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/areaf');
      
      if (!response.ok) {
        throw new Error('Error al cargar las áreas');
      }
      
      const result = await response.json();
      const areasData = result.data || result || [];
      setAreas(areasData);
    } catch (error) {
      console.error('Error loading areas:', error);
    }
  };

  // Load lots from API
  const loadLots = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://backend-pharmatrix.onrender.com/api/pharmatrix/lote');
      
      if (!response.ok) {
        throw new Error('Error al cargar los lotes');
      }
      
      const result = await response.json();
      const lotsData = result.data || result || [];
      
      console.log('Lotes cargados:', lotsData);
      setLotSchedules(lotsData);
    } catch (error) {
      setError(`Error al cargar datos: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAreas();
    loadLots();
  }, []);

  // Filter lots by selected plant
  const getFilteredLots = () => {
    if (!selectedPlant) return lotSchedules;
    return lotSchedules.filter(lot => lot.planta === selectedPlant);
  };

  // Get filtered areas for the calendar
  const getFilteredAreas = () => {
    if (!selectedPlant) return areas;
    return areas.filter(area => area.Planta === selectedPlant);
  };

  // Handle create new lot
  const handleCreateLot = () => {
    setEditingItem(null);
    setShowLotModal(true);
  };

  // Handle edit item
  const handleEditItem = (item, type) => {
    setEditingItem({ ...item, type });
    if (type === 'lot') {
      setShowLotModal(true);
    }
  };

  // Handle item saved
  const handleItemSaved = (newLot) => {
    loadLots();
    setShowLotModal(false);
    setEditingItem(null);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowLotModal(false);
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

  // Handle create event (double click on calendar)
  const handleCreateEvent = (eventData) => {
    setEditingItem({
      ...eventData,
      planta: selectedPlant // Pass selected plant to the modal
    });
    setShowLotModal(true);
  };

  // Handle plant filter change
  const handlePlantChange = (plant) => {
    setSelectedPlant(plant);
  };

  if (loading && lotSchedules.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-muted-foreground">Cargando calendario de lotes...</span>
        </div>
      </div>
    );
  }

  const filteredLots = getFilteredLots();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border shadow-sm z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold text-foreground">
                Planificación de Lotes - Phamadel
              </h1>
              
              {/* Navigation buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDateNavigation(-1)}
                  className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors text-sm"
                >
                  Hoy
                </button>
                <button
                  onClick={() => handleDateNavigation(1)}
                  className="px-3 py-2 border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Current date display */}
              <h2 className="text-lg text-muted-foreground">
                {currentDate.toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long',
                  ...(currentView === 'day' && { day: 'numeric' })
                })}
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              {/* Plant Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-foreground">Planta:</label>
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => handlePlantChange('FARMA')}
                    className={`px-4 py-1 text-sm rounded transition-colors ${
                      selectedPlant === 'FARMA' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-background'
                    }`}
                  >
                    FARMA
                  </button>
                  <button
                    onClick={() => handlePlantChange('BETA')}
                    className={`px-4 py-1 text-sm rounded transition-colors ${
                      selectedPlant === 'BETA' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-background'
                    }`}
                  >
                    BETA
                  </button>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                {['month', 'week', 'day'].map(view => (
                  <button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={`px-3 py-1 text-xs capitalize rounded transition-colors ${
                      currentView === view 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-background'
                    }`}
                  >
                    {view === 'month' ? 'Mes' : view === 'week' ? 'Semana' : 'Día'}
                  </button>
                ))}
              </div>

              {/* Create button */}
              <button
                onClick={handleCreateLot}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nuevo Lote</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-muted-foreground">
                Total de lotes: <span className="font-semibold text-foreground">{filteredLots.length}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-muted-foreground">
                Áreas activas: <span className="font-semibold text-foreground">{getFilteredAreas().length}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-error font-medium">Error</p>
            </div>
            <p className="text-sm text-error mt-1">{error}</p>
          </div>
        )}

        {/* Calendar Component */}
        <div className="flex-1 p-6">
          <div className="bg-card rounded-lg shadow-sm border border-border h-full">
            <CalendarView
              view={currentView}
              currentDate={currentDate}
              lotSchedules={filteredLots}
              areas={getFilteredAreas()}
              onSelectDate={setSelectedDate}
              onCreateEvent={handleCreateEvent}
              onEditItem={handleEditItem}
            />
          </div>
        </div>
      </div>

      {/* Modal de Lote */}
      {showLotModal && (
        <LotModal
          isOpen={showLotModal}
          onClose={handleModalClose}
          editingLot={editingItem}
          defaultDate={editingItem?.fechaPhani}
          defaultArea={editingItem?.areaFabricacion}
          defaultPlant={editingItem?.planta || selectedPlant}
          onSaved={handleItemSaved}
        />
      )}
    </div>
  );
};

export default LotPlanningPage;