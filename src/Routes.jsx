import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/login';
import MainDashboard from './pages/main-dashboard';
import ProductionTraceability from './pages/production-traceability';
import QualityControlValidation from './pages/quality-control-validation';
import BatchRecordManagement from './pages/batch-record-management';
import DeviationManagement from './pages/deviation-management';
import NotFound from './pages/NotFound';
import LotPlanningPage from './pages/lot-planning';
import EmisionPage from 'pages/emision/EmisionPage';
import SupervisoresDashboardf from 'pages/supervision-fabricacion/SupervisoresDashboard'

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ScrollToTop />
          <RouterRoutes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/main-dashboard" element={<MainDashboard />} />
            <Route path="/production-traceability" element={<ProductionTraceability />} />
            <Route path="/quality-control-validation" element={<QualityControlValidation />} />
            <Route path="/batch-record-management" element={<BatchRecordManagement />} />
            <Route path="/deviation-management" element={<DeviationManagement />} />
            <Route path="/lot-planning" element={<LotPlanningPage />} />
            <Route path="/emision" element={<EmisionPage/>}/> 
            <Route path='/supervisor' element={<SupervisoresDashboardf/>}/>
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
