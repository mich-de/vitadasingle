import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  itemType?: string;
  loading?: boolean;
  destructive?: boolean;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  itemType = 'elemento',
  loading = false,
  destructive = true
}) => {
  const defaultTitle = `Elimina ${itemType}`;
  const defaultMessage = itemName 
    ? `Sei sicuro di voler eliminare "${itemName}"? Questa azione non può essere annullata.`
    : `Sei sicuro di voler eliminare questo ${itemType}? Questa azione non può essere annullata.`;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || defaultTitle}
      size="sm"
    >
      <div className="space-y-4">
        {/* Warning Icon and Message */}
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            destructive 
              ? 'bg-red-100 dark:bg-red-900/30' 
              : 'bg-yellow-100 dark:bg-yellow-900/30'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              destructive 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-yellow-600 dark:text-yellow-400'
            }`} />
          </div>
          
          <div className="flex-1">
            <p className="text-text-primary-light dark:text-text-primary-dark">
              {message || defaultMessage}
            </p>
            
            {destructive && (
              <p className="mt-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                Tutti i dati associati verranno persi definitivamente.
              </p>
            )}
          </div>
        </div>
        
        {/* Item Details (if provided) */}
        {itemName && (
          <div className="p-3 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
            <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
              {itemType} da eliminare:
            </p>
            <p className="font-medium text-text-primary-light dark:text-text-primary-dark truncate">
              {itemName}
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annulla
          </Button>
          
          <Button
            variant="danger"
            icon={Trash2}
            onClick={handleConfirm}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Eliminazione...' : 'Elimina'}
          </Button>
        </div>
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white dark:bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent" />
              <span className="text-sm text-text-primary-light dark:text-text-primary-dark">
                Eliminazione in corso...
              </span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};