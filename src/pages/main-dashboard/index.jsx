import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import KPICard from './components/KPICard';
import AlertsPanel from './components/AlertsPanel';
import ProductionOverview from './components/ProductionOverview';
import AuditActivities from './components/AuditActivities';
import QuickActions from './components/QuickActions';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const kpiData = [
    {
      title: 'Lotes Activos',
      value: '12',
      subtitle: '3 en proceso crítico',
      icon: 'Package',
      trend: 'up',
      trendValue: '+2',
      severity: 'default',
      onClick: () => navigate('/production-traceability')
    },
    {
      title: 'Validaciones Pendientes',
      value: '8',
      subtitle: '2 vencen hoy',
      icon: 'ShieldCheck',
      trend: 'down',
      trendValue: '-3',
      severity: 'warning',
      onClick: () => navigate('/quality-control-validation')
    },
    {
      title: 'Alertas Críticas',
      value: '3',
      subtitle: 'Requieren atención inmediata',
      icon: 'AlertTriangle',
      trend: 'up',
      trendValue: '+1',
      severity: 'critical',
      onClick: () => navigate('/deviation-management')
    },
    {
      title: 'Cumplimiento',
      value: '98.5%',
      subtitle: 'Objetivo: 99%',
      icon: 'CheckCircle',
      trend: 'up',
      trendValue: '+0.2%',
      severity: 'success',
      onClick: () => navigate('/main-dashboard')
    }
  ];

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const formatLastUpdated = (date) => {
    return date?.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
        />
      </div>
      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-6 space-y-6">
          {/* Breadcrumb */}
          <BreadcrumbTrail />

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Panel Principal</h1>
              <p className="text-muted-foreground mt-1">
                Resumen general del sistema de gestión de calidad farmacéutica
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Última actualización: {formatLastUpdated(lastUpdated)}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-xs text-success">Sistema en línea</span>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                subtitle={kpi?.subtitle}
                icon={kpi?.icon}
                trend={kpi?.trend}
                trendValue={kpi?.trendValue}
                severity={kpi?.severity}
                onClick={kpi?.onClick}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Alerts Panel */}
          <AlertsPanel />

          {/* Production Overview */}
          <ProductionOverview />

          {/* Audit Activities and Deadlines */}
          <AuditActivities />
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;