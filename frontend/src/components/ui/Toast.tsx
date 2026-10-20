import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  actions?: React.ReactNode;
  glass?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  actions,
  glass = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimeout = setTimeout(() => setIsVisible(true), 100);
    
    // Auto close
    const closeTimeout = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimeout);
      clearTimeout(closeTimeout);
    };
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(id);
    }, 300); // Corresponds to the duration of the exit animation
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const typeClasses = {
    success: 'bg-green-500/80 border-green-400/90 text-green-50',
    error: 'bg-red-500/80 border-red-400/90 text-red-50',
    warning: 'bg-yellow-500/80 border-yellow-400/90 text-yellow-50',
    info: 'bg-blue-500/80 border-blue-400/90 text-blue-50',
  };

  const Icon = icons[type];
  const baseClasses = 'w-full max-w-sm rounded-lg shadow-lg p-4 flex items-start gap-3 transition-all duration-300 ease-in-out';
  const glassmorphism = glass ? 'backdrop-blur-md bg-opacity-60 border' : 'bg-opacity-100';
  const animationClasses = isVisible ? (isExiting ? 'animate-out slide-out-to-right fade-out' : 'animate-in slide-in-from-right fade-in') : 'opacity-0';

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${glassmorphism} ${animationClasses}`}>
      <div className="flex-shrink-0">
        <Icon size={22} className="mt-0.5" />
      </div>
      <div className="flex-1">
        {title && <h3 className="font-bold text-base">{title}</h3>}
        <p className="text-sm">{message}</p>
        {actions && <div className="mt-2">{actions}</div>}
      </div>
      <div className="flex-shrink-0 ml-2">
        <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// Container to manage multiple toasts
export interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onRemoveToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onRemoveToast} />
      ))}
    </div>
  );
};