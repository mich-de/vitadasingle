import React from 'react';
import { Modal } from '../ui/Modal';
import { DeadlineForm } from '../../features/deadlines/components/DeadlineForm';
import type { Deadline, CreateDeadlineInput, UpdateDeadlineInput } from "../../types";

interface DeadlineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadline: CreateDeadlineInput | UpdateDeadlineInput) => Promise<void>;
  deadline?: Deadline;
  isEditing: boolean;
}

const DeadlineFormModal: React.FC<DeadlineFormModalProps> = ({ isOpen, onClose, onSave, deadline, isEditing }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifica Scadenza' : 'Aggiungi Scadenza'}
      size="lg"
    >
      <DeadlineForm
        initialData={deadline}
        onSubmit={onSave}
        onCancel={onClose}
        isEdit={isEditing}
      />
    </Modal>
  );
};

export default DeadlineFormModal;