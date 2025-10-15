import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeMap = {
    '/main-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/production-traceability': { label: 'Production Traceability', icon: 'Factory', parent: '/main-dashboard' },
    '/quality-control-validation': { label: 'Quality Control Validation', icon: 'ShieldCheck', parent: '/main-dashboard' },
    '/batch-record-management': { label: 'Batch Record Management', icon: 'FileText', parent: '/production-traceability' },
    '/deviation-management': { label: 'Deviation Management', icon: 'AlertTriangle', parent: '/main-dashboard' },
    '/login': { label: 'Login', icon: 'LogIn' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const currentPath = location?.pathname;
    const breadcrumbs = [];
    
    // Always start with Dashboard unless we're on login
    if (currentPath !== '/login' && currentPath !== '/main-dashboard') {
      breadcrumbs?.push({
        label: 'Dashboard',
        path: '/main-dashboard',
        icon: 'LayoutDashboard'
      });
    }

    // Add current page
    const currentRoute = routeMap?.[currentPath];
    if (currentRoute) {
      breadcrumbs?.push({
        label: currentRoute?.label,
        path: currentPath,
        icon: currentRoute?.icon,
        isActive: true
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1 && location?.pathname === '/main-dashboard') {
    return null;
  }

  const handleNavigation = (path) => {
    if (path && path !== location?.pathname) {
      navigate(path);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Icon name="Home" size={16} className="text-muted-foreground" />
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path || index}>
          {index > 0 && (
            <Icon name="ChevronRight" size={14} className="text-muted-foreground" />
          )}
          
          {crumb?.isActive ? (
            <span className="flex items-center space-x-1.5 text-foreground font-medium">
              <Icon name={crumb?.icon} size={14} />
              <span>{crumb?.label}</span>
            </span>
          ) : (
            <button
              onClick={() => handleNavigation(crumb?.path)}
              className="flex items-center space-x-1.5 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name={crumb?.icon} size={14} />
              <span>{crumb?.label}</span>
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbTrail;