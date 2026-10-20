import React from 'react';
import { Modal } from '../ui/Modal';
import { VehicleForm } from '../../features/vehicles/components/VehicleForm';
import type { Vehicle, CreateVehicleInput, UpdateVehicleInput } from "../../types/entities/vehicle";

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vehicle: CreateVehicleInput | UpdateVehicleInput) => Promise<void>;
  vehicle?: Vehicle;
  isEditing: boolean;
}

const VehicleFormModal: React.FC<VehicleFormModalProps> = ({ isOpen, onClose, onSave, vehicle, isEditing }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifica Veicolo' : 'Aggiungi Veicolo'}
      size="lg"
    >
      <VehicleForm
        initialData={vehicle}
        onSubmit={onSave}
        onCancel={onClose}
        isEdit={isEditing}
      />
    </Modal>
  );
};

export default VehicleFormModal;