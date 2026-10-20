import React from 'react';
import { Modal } from '../ui/Modal';
import { PropertyForm } from '../../features/properties/components/PropertyForm';
import type { Property, CreatePropertyInput, UpdatePropertyInput } from "../../types/entities/property";

interface PropertyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (property: CreatePropertyInput | UpdatePropertyInput) => Promise<void>;
  property?: Property;
  isEditing: boolean;
}

const PropertyFormModal: React.FC<PropertyFormModalProps> = ({ isOpen, onClose, onSave, property, isEditing }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifica Proprietà' : 'Aggiungi Proprietà'}
      size="lg"
    >
      <PropertyForm
        initialData={property}
        onSubmit={onSave}
        onCancel={onClose}
        isEdit={isEditing}
      />
    </Modal>
  );
};

export default PropertyFormModal;