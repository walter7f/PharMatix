import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BackgroundPattern from './components/BackgroundPattern';
import logo from '../../images/logo.jpg'

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('pharmaTrace_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const loginTime = new Date(user.loginTime);
        const currentTime = new Date();
        const timeDifference = currentTime - loginTime;
        const hoursElapsed = timeDifference / (1000 * 60 * 60);

        // Check if session is still valid (24 hours for remember me, 8 hours otherwise)
        const sessionDuration = user?.rememberMe ? 24 : 8;
        
        if (hoursElapsed < sessionDuration) {
          navigate('/main-dashboard');
        } else {
          // Session expired, clear storage
          localStorage.removeItem('pharmaTrace_user');
        }
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('pharmaTrace_user');
      }
    }

    // Set page title
    document.title = 'Iniciar Sesión - PharmaTrace Pro';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <BackgroundPattern />
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-4">
                    <img src={logo} alt="Logo" style={{ width: '50px', height: '50px' }}/>
                    <div>
                      <h1 className="text-xl font-semibold text-foreground">Phamatrix</h1>
                      <p className="text-sm text-muted-foreground">
                        Sistema de Gestión y Trazabilidad Farmacéutica
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Login Section */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Welcome Content */}
              <div className="hidden lg:block space-y-8">
                <div className="flex items-center gap-4"> 
                  <img src={logo} alt="Logo" style={{ width: '50px', height: '50px' }}/>
                  <h2 className="text-4xl font-bold text-foreground mb-4">
                    Pharmatrix
                  </h2>
                  </div>
                  <div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Tu plataforma integral para la gestión de calidad farmacéutica, 
                    trazabilidad de producción y cumplimiento regulatorio.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Trazabilidad Completa</h3>
                        <p className="text-sm text-muted-foreground">
                          Seguimiento en tiempo real de todos los procesos de producción
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Cumplimiento Regulatorio</h3>
                        <p className="text-sm text-muted-foreground">
                          Conforme con FDA 21 CFR Part 11, GMP y estándares ISO
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center mt-0.5">
                        <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">Gestión de Desviaciones</h3>
                        <p className="text-sm text-muted-foreground">
                          Sistema CAPA integrado para acciones correctivas y preventivas
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="w-full">
                <LoginForm />
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 border-t border-border bg-card/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <span>© {new Date()?.getFullYear()} Pharmatrix</span>
                <span>•</span>
                <button className="hover:text-foreground transition-colors duration-200">
                  Política de Privacidad
                </button>
                <span>•</span>
                <button className="hover:text-foreground transition-colors duration-200">
                  Términos de Servicio
                </button>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Soporte 24/7:</span>
                <a 
                  href="mailto:soporte@pharmatrace.com"
                  className="text-primary hover:text-primary/80 transition-colors duration-200"
                >
                  walter13457@gmail.com
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LoginPage;