import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ collapsed, onToggle, currentPath }) => {
  const location = useLocation();
  const { user, userProfile, signOut } = useAuth();
  
  // Navigation items with new planning module
  const navItems = [
    {
      path: '/main-dashboard',
      icon: 'BarChart3',
      label: 'Dashboard',
      description: 'Vista general del sistema'
    },
    {
      path: '/lot-planning',
      icon: 'Calendar',
      label: 'Planificación',
      description: 'Calendario de lotes'
    },
    {
      path: '/production-traceability',
      icon: 'Factory',
      label: 'Trazabilidad',
      description: 'Seguimiento de producción'
    },
    {
      path: '/quality-control-validation',
      icon: 'Shield',
      label: 'Control Calidad',
      description: 'Validación y pruebas'
    },
    {
      path: '/batch-record-management',
      icon: 'FileText',
      label: 'Registros',
      description: 'Gestión de lotes'
    },
    {
      path: '/deviation-management',
      icon: 'AlertTriangle',
      label: 'Desviaciones',
      description: 'Gestión de incidencias'
    }
  ];

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
       localStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <aside className={`
      fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Pill" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-foreground">PharmaTrace</h1>
                  <p className="text-xs text-muted-foreground">Quality System</p>
                </div>
              </div>
            )}
            
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Icon name={collapsed ? "ChevronRight" : "ChevronLeft"} size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems?.map((item) => {
            const isActive = location?.pathname === item?.path || currentPath === item?.path;
            
            return (
              <Link
                key={item?.path}
                to={item?.path}
                className={`
                  flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{item?.label}</div>
                    <div className="text-xs opacity-80 truncate">{item?.description}</div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 border-t border-border">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {JSON.parse(localStorage.getItem('harmatrix_user'))?.nameUser || userProfile?.full_name || user?.email?.split('@')?.[0]}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {JSON.parse(localStorage.getItem('harmatrix_user'))?.puestoUser || userProfile?.role || 'Usuario'}
                  </div>
                </div>
              )}
            </div>
            
            {!collapsed && (
              <button
                onClick={handleSignOut}
                className="w-full mt-3 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors duration-200"
              >
                <Icon name="LogOut" size={16} />
                <span>Cerrar Sesión</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;