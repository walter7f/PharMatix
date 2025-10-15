import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import pharmadel from '../../../images/images.jpg'

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Mock credentials for different user roles (Supabase users)
  /*const mockCredentials = [
    { email: 'admin@pharmatrace.com', password: 'Admin123!', role: 'Dr. Maria Rodriguez (Admin)' },
    { email: 'production@pharmatrace.com', password: 'Prod123!', role: 'Carlos Mendez (Production Manager)' },
    { email: 'quality@pharmatrace.com', password: 'Quality123!', role: 'Ana Silva (Quality Manager)' },
    { email: 'operator@pharmatrace.com', password: 'Operator123!', role: 'Juan Perez (Operator)' }
  ];*/

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Por favor, introduce un correo electrónico válido';
    }

    if (!formData?.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (formData?.password?.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Use Supabase authentication
      const { data, error } = await signIn(formData?.email, formData?.password);

      if (error) {
        // Check if it's a network/infrastructure error
        if (error?.message?.includes('Failed to fetch') || 
            error?.message?.includes('AuthRetryableFetchError') ||
            error?.message?.includes('Network Error')) {
          setErrors({
            general: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
          });
        } else {
          // Authentication error from Supabase
          setErrors({
            general: error?.message || 'Credenciales incorrectas. Por favor, verifica tu correo electrónico y contraseña.'
          });
        }
        return;
      }

      // Successfully authenticated - navigate to dashboard
      if (data?.user) {
        navigate('/main-dashboard');
      }
    } catch (error) {
      // JavaScript runtime error (actual code bug)
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError') ||
          error?.name === 'TypeError' && error?.message?.includes('fetch')) {
        setErrors({
          general: 'Cannot connect to authentication service. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        });
      } else {
        setErrors({
          general: 'Error de conexión. Por favor, inténtalo de nuevo.'
        });
        console.error('JavaScript error in auth:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('Se ha enviado un enlace de recuperación a tu correo electrónico.');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-lg border border-border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4">
            <img src={pharmadel} alt="" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Iniciar Sesión
          </h1>
          <p className="text-muted-foreground text-sm">
            Accede a tu sistema de gestión farmacéutica
          </p>
        </div>

        {/* Error Message */}
        {errors?.general && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} className="text-error" />
              <p className="text-sm text-error">{errors?.general}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            placeholder="tu@empresa.com"
            value={formData?.email}
            onChange={handleInputChange}
            error={errors?.email}
            required
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Introduce tu contraseña"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
              disabled={isLoading}
            >
              <Icon name={showPassword ? "EyeOff" : "Eye"} size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label="Recordarme"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
              disabled={isLoading}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="LogIn"
            iconPosition="right"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Demo Credentials Info - Now shows Supabase credentials */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground text-center mb-2">
            Credenciales de demostración (Supabase):
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Admin: admin@pharmatrace.com / Admin123!</div>
            <div>Production: production@pharmatrace.com / Prod123!</div>
            <div>Quality: quality@pharmatrace.com / Quality123!</div>
            <div>Operator: operator@pharmatrace.com / Operator123!</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;