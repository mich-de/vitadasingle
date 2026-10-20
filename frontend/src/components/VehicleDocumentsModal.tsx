import { useLanguage } from '../context/LanguageContext';
import { Button } from './ui/button';

interface VehicleItem {
  id: string;
  name: string;
  documents?: string[];
}

interface VehicleDocumentsModalProps {
  vehicle: VehicleItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const VehicleDocumentsModal = ({ vehicle, isOpen, onClose }: VehicleDocumentsModalProps) => {
  const { t } = useLanguage();

  if (!isOpen || !vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">{t('vehicles.documentsFor')} {vehicle.name}</h2>
        
        <div>
          {vehicle.documents && vehicle.documents.length > 0 ? (
            <ul>
              {vehicle.documents.map((doc, index) => (
                <li key={index} className="p-2 border-b border-border-light dark:border-border-dark">{doc}</li>
              ))}
            </ul>
          ) : (
            <p>{t('vehicles.noDocuments')}</p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button type="button" onClick={onClose}>{t('common.close')}</Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDocumentsModal;