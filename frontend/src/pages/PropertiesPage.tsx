import { useState } from 'react';
import { useProperties } from '../hooks/useProperties';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import PropertyFormModal from '../components/modals/PropertyFormModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '../types';
import type { PropertyType } from '../types/entities/property';
import { PlusCircle, Edit, Trash2, Home, Building } from 'lucide-react';

const PropertiesPage = () => {
  const { t } = useLanguage();
  const { properties, loading, error, addProperty, updateProperty, deleteProperty } = useProperties();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);

  const handleAddClick = () => {
    setSelectedProperty(undefined);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (property: Property) => {
    setSelectedProperty(property);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (property: Property) => {
    setSelectedProperty(property);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProperty) {
      await deleteProperty(selectedProperty.id);
      setIsDeleteModalOpen(false);
      setSelectedProperty(undefined);
    }
  };

  const handleSaveProperty = async (data: CreatePropertyInput | UpdatePropertyInput) => {
    if (selectedProperty) {
      await updateProperty(selectedProperty.id, data as UpdatePropertyInput);
    } else {
      await addProperty(data as CreatePropertyInput);
    }
    setIsFormModalOpen(false);
    setSelectedProperty(undefined);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(t('dates.locale'), {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{t('common.error')}: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('properties.title')}</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('properties.dataSource') }}
          ></p>
        </div>
        <Button onClick={handleAddClick}><PlusCircle className="mr-2" size={18} />{t('properties.addNew')}</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('properties.summary.totalProperties')}
          </h3>
          <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {properties.length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('properties.summary.residential')}
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {properties.filter(p => p.type === 'residential').length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('properties.summary.commercial')}
          </h3>
          <p className="text-2xl font-bold text-yellow-500">
            {properties.filter(p => p.type === 'commercial').length}
          </p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-3">{t('properties.table.property')}</th>
                <th className="p-3">{t('properties.table.type')}</th>
                <th className="p-3">{t('properties.table.currentValue')}</th>
                <th className="p-3 text-right">{t('properties.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id} className="border-b border-border-light/50 dark:border-border-dark/50 hover:bg-background-light dark:hover:bg-background-dark">
                  <td className="p-3 flex items-center">
                    {property.type === 'residential' ? <Building className="mr-3 text-primary-light dark:text-primary-dark" /> : <Home className="mr-3 text-primary-light dark:text-primary-dark" />}
                    <div>
                      <div className="font-medium">{property.name}</div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{property.address}</div>
                    </div>
                  </td>
                <td className="p-3">
                  <div className="flex items-center">
                    {property.type === 'residential' && <Home size={20} className="mr-2" />}
                    {property.type === 'commercial' && <Building size={20} className="mr-2" />}
                    {property.type === 'rental' && <Home size={20} className="mr-2" />}
                    {property.type === 'villa' && <Home size={20} className="mr-2" />}
                    {property.type === 'chalet' && <Home size={20} className="mr-2" />}
                    {t(`properties.type.${property.type.toLowerCase()}`)}
                  </div>
                </td>
                  <td className="p-3">{property.currentValue ? formatCurrency(property.currentValue) : '-'}</td>
                  <td className="p-3 text-right">
                    <Button variant="secondary" size="sm" onClick={() => handleEditClick(property)}><Edit size={18} /></Button>
                    <Button variant="secondary" size="sm" onClick={() => handleDeleteClick(property)} className="text-red-500"><Trash2 size={18} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <PropertyFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveProperty}
          property={selectedProperty}
          isEditing={!!selectedProperty}
        />
      )}

      {isDeleteModalOpen && selectedProperty && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t('properties.deleteModal.title', { name: selectedProperty.name })}
          message={t('properties.deleteModal.message')}
        />
      )}
    </div>
  );
};

export default PropertiesPage;
