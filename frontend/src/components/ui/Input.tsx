import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  helperText?: string;
  multiline?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  multiline = false,
  id,
  ...props
}, ref) => {
  const inputClasses = `
    w-full px-4 py-2.5 border rounded-lg transition-all duration-300 ease-in-out
    bg-background-light dark:bg-gray-800 
    text-text-primary-light dark:text-text-primary-dark
    placeholder-text-secondary-light dark:placeholder-text-secondary-dark
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light/50 dark:focus:ring-primary-dark/50
    focus:shadow-lg
    disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-700
    ${error 
      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/50' 
      : 'border-gray-300 dark:border-gray-600 focus:border-primary-light dark:focus:border-primary-dark'
    }
    ${Icon ? 'pl-11' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id || props.name} className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-text-secondary-light dark:text-text-secondary-dark" />
          </div>
        )}
        {multiline ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id || props.name}
            className={inputClasses}
            {...props}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={id || props.name}
            className={inputClasses}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';