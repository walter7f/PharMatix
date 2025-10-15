import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SignatureModal = ({ isOpen, onClose, onConfirm, stepName }) => {
  const [signatureData, setSignatureData] = useState({
    username: '',
    password: '',
    comments: '',
    timestamp: new Date()?.toISOString()
  });
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const mockCredentials = {
    username: 'dr.chen',
    password: 'pharma2024'
  };

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setSignatureData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (signatureData?.username !== mockCredentials?.username || 
        signatureData?.password !== mockCredentials?.password) {
      alert('Credenciales incorrectas. Use: dr.chen / pharma2024');
      return;
    }

    onConfirm({
      ...signatureData,
      signatureCanvas: canvasRef?.current?.toDataURL()
    });
    
    setSignatureData({
      username: '',
      password: '',
      comments: '',
      timestamp: new Date()?.toISOString()
    });
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const ctx = canvas?.getContext('2d');
    ctx?.beginPath();
    ctx?.moveTo(e?.clientX - rect?.left, e?.clientY - rect?.top);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef?.current;
    const rect = canvas?.getBoundingClientRect();
    const ctx = canvas?.getContext('2d');
    ctx?.lineTo(e?.clientX - rect?.left, e?.clientY - rect?.top);
    ctx?.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Firma Electrónica</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Proceso: {stepName}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Usuario"
              type="text"
              placeholder="Ingrese su usuario"
              value={signatureData?.username}
              onChange={(e) => handleInputChange('username', e?.target?.value)}
              required
            />
            
            <Input
              label="Contraseña"
              type="password"
              placeholder="Ingrese su contraseña"
              value={signatureData?.password}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Firma Digital
            </label>
            <div className="border border-border rounded-lg p-4 bg-muted/30">
              <canvas
                ref={canvasRef}
                width={400}
                height={150}
                className="w-full border border-border rounded bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-muted-foreground">
                  Dibuje su firma en el área superior
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  onClick={clearSignature}
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </div>

          <Input
            label="Comentarios (Opcional)"
            type="text"
            placeholder="Agregue comentarios sobre este proceso..."
            value={signatureData?.comments}
            onChange={(e) => handleInputChange('comments', e?.target?.value)}
            description="Cualquier observación relevante sobre el proceso"
          />

          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-accent" />
              <span className="text-sm font-medium text-foreground">Información de la Firma</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Fecha y Hora: {new Date(signatureData.timestamp)?.toLocaleString()}</p>
              <p>IP Address: 192.168.1.100</p>
              <p>Estación: PROD-WS-001</p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="default"
              iconName="PenTool"
            >
              Confirmar Firma
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignatureModal;