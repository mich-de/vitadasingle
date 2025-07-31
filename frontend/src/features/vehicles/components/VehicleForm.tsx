import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input, Select, Button } from '../../../components/ui';
import type { Vehicle, VehicleType, VehicleStatus } from '../../../types/entities/vehicle';

interface VehicleFormProps {
  initialData?: Partial<Vehicle>;
  onSubmit: (data: Partial<Vehicle>) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const typeOptions: { value: VehicleType; label: string }[] = [
  { value: 'car', label: 'Auto' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'van', label: 'Furgone' },
  { value: 'other', label: 'Altro' }
];

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: 'active', label: 'Attivo' },
  { value: 'sold', label: 'Venduto' },
  { value: 'maintenance', label: 'Manutenzione' }
];

export const VehicleForm: React.FC<VehicleFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const form = useForm<Partial<Vehicle>>({
    initialValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || '',
      licensePlate: initialData?.licensePlate || '',
      type: initialData?.type || 'car',
      status: initialData?.status || 'active',
      purchaseDate: initialData?.purchaseDate || '',
      purchasePrice: initialData?.purchasePrice || '',
      currentValue: initialData?.currentValue || '',
      notes: initialData?.notes || ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof Vehicle, string>> = {};
      if (!values.make || !values.make.trim()) {
        errors.make = 'Marca obbligatoria';
      }
      if (!values.model || !values.model.trim()) {
        errors.model = 'Modello obbligatorio';
      }
      if (!values.type) {
        errors.type = 'Tipo obbligatorio';
      }
      if (!values.status) {
        errors.status = 'Stato obbligatorio';
      }
      if (values.year && (isNaN(Number(values.year)) || Number(values.year) < 1900)) {
        errors.year = 'Anno non valido';
      }
      if (values.purchasePrice && (isNaN(Number(values.purchasePrice)) || Number(values.purchasePrice) < 0)) {
        errors.purchasePrice = 'Prezzo di acquisto non valido';
      }
      if (values.currentValue && (isNaN(Number(values.currentValue)) || Number(values.currentValue) < 0)) {
        errors.currentValue = 'Valore attuale non valido';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    }
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Marca"
          name="make"
          required
          {...form.getFieldProps('make')}
        />
        <Input
          label="Modello"
          name="model"
          required
          {...form.getFieldProps('model')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Anno"
          name="year"
          type="number"
          {...form.getFieldProps('year')}
        />
        <Input
          label="Targa"
          name="licensePlate"
          {...form.getFieldProps('licensePlate')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo"
          name="type"
          options={typeOptions}
          required
          {...form.getFieldProps('type')}
        />
        <Select
          label="Stato"
          name="status"
          options={statusOptions}
          required
          {...form.getFieldProps('status')}
        />
      </div>
      <Input
        label="Data di acquisto"
        name="purchaseDate"
        type="date"
        {...form.getFieldProps('purchaseDate')}
      />
      <Input
        label="Prezzo di acquisto (€)"
        name="purchasePrice"
        type="number"
        {...form.getFieldProps('purchasePrice')}
      />
      <Input
        label="Valore attuale (€)"
        name="currentValue"
        type="number"
        {...form.getFieldProps('currentValue')}
      />
      <Input
        label="Note"
        name="notes"
        multiline
        {...form.getFieldProps('notes')}
      />
      <div className="flex space-x-2">
        <Button type="submit">{isEdit ? 'Salva Modifiche' : 'Aggiungi'}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>Annulla</Button>
        )}
      </div>
    </form>
  );
};