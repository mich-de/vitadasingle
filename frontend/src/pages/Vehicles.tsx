import { useState } from 'react';
import { formatCurrency, formatDate, getDaysRemaining, getTypeLabel, getFuelTypeLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { useVehicles } from '../hooks/useVehicles';
import VehicleFormModal from '../components/modals/VehicleFormModal';
import type { CreateVehicleInput, UpdateVehicleInput, Vehicle as VehicleItem } from '../types/entities/vehicle';

const Vehicles = () => {
  const { t } = useLanguage();
  const { vehicles, loading, error, fetchVehicles, createVehicle, updateVehicle, deleteVehicle } = useVehicles();
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleItem | undefined>(undefined);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleAddNew = () => {
    setSelectedVehicle(undefined);
    setIsEditing(false);
    setIsFormModalOpen(true);
  };

  const handleEdit = (vehicle: VehicleItem) => {
    setSelectedVehicle(vehicle);
    setIsEditing(true);
    setIsFormModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('vehicles.confirmDelete'))) {
      deleteVehicle(id);
    }
  };

  const handleSave = async (data: CreateVehicleInput | UpdateVehicleInput) => {
    try {
      if (isEditing && selectedVehicle) {
        await updateVehicle(selectedVehicle.id, data as UpdateVehicleInput);
      } else {
        await createVehicle(data as CreateVehicleInput);
      }
      fetchVehicles();
      setIsFormModalOpen(false);
    } catch (err) {
      // Error handling is now in the hook, but we can still show a toast here if needed
      console.error('Failed to save vehicle', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('vehicles.loading')}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span>{t(error)}</span>
        </div>
        <button 
          onClick={fetchVehicles}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('vehicles.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('vehicles.dataLoadedFrom') }}
          ></p>
        </div>
        <button onClick={handleAddNew} className="px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90">
          {t('vehicles.addNew')}
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg shadow-soft overflow-hidden bg-card-light dark:bg-card-dark">
            <div className="px-4 py-3 border-b border-border-light dark:border-border-dark">
              <h2 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                {t('vehicles.myVehicles', { count: vehicles.length })}
              </h2>
            </div>
            
            {vehicles.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-text-secondary-light dark:text-text-secondary-dark">
                  {t('vehicles.noVehiclesFound')}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border-light dark:divide-border-dark">
                  <thead className="bg-background-light dark:bg-background-dark">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {t('vehicles.table.vehicle')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {t('vehicles.table.type')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {t('vehicles.table.status')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {t('vehicles.table.currentValue')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary-light dark:text-text-secondary-dark">
                        {t('vehicles.table.action')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-light dark:bg-card-dark divide-y divide-border-light dark:divide-border-dark">
                    {vehicles.map(vehicle => (
                      <tr key={vehicle.id} className={`hover:bg-background-light dark:hover:bg-background-dark cursor-pointer ${selectedVehicle?.id === vehicle.id ? 'bg-primary-light/10 dark:bg-primary-dark/10' : ''}`} onClick={() => setSelectedVehicle(vehicle)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">{vehicle.make} {vehicle.model}</div>
                          <div className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {vehicle.year} - {vehicle.licensePlate}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {getTypeLabel(vehicle.type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {vehicle.status}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary-light dark:text-text-secondary-dark">
                          {formatCurrency(vehicle.currentValue)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={e => { e.stopPropagation(); handleEdit(vehicle); }} className="text-primary-light hover:text-primary-light/80 dark:text-primary-dark dark:hover:text-primary-dark/80 mr-3">
                            {t('common.edit')}
                          </button>
                          <button onClick={e => { e.stopPropagation(); handleDelete(vehicle.id); }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                            {t('common.delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        {/* Vehicle Preview Panel */}
        <div className="hidden lg:block">
          {selectedVehicle ? (
            <div className="rounded-lg shadow-soft bg-card-light dark:bg-card-dark p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
                {t('vehicles.vehicleDetails')}
              </h3>
              <div className="space-y-2">
                <div><span className="font-medium">{t('vehicles.form.make')}:</span> {selectedVehicle.make}</div>
                <div><span className="font-medium">{t('vehicles.form.model')}:</span> {selectedVehicle.model}</div>
                <div><span className="font-medium">{t('vehicles.form.year')}:</span> {selectedVehicle.year}</div>
                <div><span className="font-medium">{t('vehicles.form.licensePlate')}:</span> {selectedVehicle.licensePlate}</div>
                <div><span className="font-medium">{t('vehicles.form.type')}:</span> {getTypeLabel(selectedVehicle.type)}</div>
                <div><span className="font-medium">{t('vehicles.form.status')}:</span> {selectedVehicle.status}</div>
                <div><span className="font-medium">{t('vehicles.form.currentValue')}:</span> {formatCurrency(selectedVehicle.currentValue)}</div>
                {selectedVehicle.purchaseDate && (
                  <div><span className="font-medium">{t('vehicles.form.purchaseDate')}:</span> {formatDate(selectedVehicle.purchaseDate)}</div>
                )}
                {selectedVehicle.purchasePrice && (
                  <div><span className="font-medium">{t('vehicles.form.purchasePrice')}:</span> {formatCurrency(selectedVehicle.purchasePrice)}</div>
                )}
                {selectedVehicle.notes && (
                  <div><span className="font-medium">{t('vehicles.form.notes')}:</span> {selectedVehicle.notes}</div>
                )}
              </div>
              <button
                className="mt-4 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-light/90 transition duration-200 dark:bg-primary-dark dark:hover:bg-primary-dark/90 w-full"
                onClick={() => handleEdit(selectedVehicle)}
              >
                {t('common.edit')}
              </button>
            </div>
          ) : (
            <div className="rounded-lg shadow-soft bg-card-light dark:bg-card-dark p-6 text-text-secondary-light dark:text-text-secondary-dark text-center">
              <span>{t('vehicles.selectVehiclePrompt')}</span>
            </div>
          )}
        </div>
      </div>

      <VehicleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSave}
        vehicle={selectedVehicle}
        isEditing={isEditing}
      />
    </div>
  );
};

export default Vehicles;