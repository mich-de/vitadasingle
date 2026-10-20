import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input, Select, Button } from '../../../components/ui';
import type { Property, PropertyType, PropertyStatus } from '../../../types';

interface PropertyFormProps {
  initialData?: Partial<Property>;
  onSubmit: (data: Partial<Property>) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const typeOptions = [
  { value: 'residential', label: 'Residenziale' },
  { value: 'commercial', label: 'Commerciale' },
  { value: 'rental', label: 'Affitto' }
];

const statusOptions = [
  { value: 'occupied', label: 'Occupato' },
  { value: 'vacant', label: 'Libero' },
  { value: 'maintenance', label: 'Manutenzione' }
];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const form = useForm<Partial<Property>>({
    initialValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      type: initialData?.type || 'residential',
      status: initialData?.status || 'vacant',
      size: initialData?.size || '',
      purchaseDate: initialData?.purchaseDate || '',
      purchasePrice: initialData?.purchasePrice || '',
      currentValue: initialData?.currentValue || '',
      notes: initialData?.notes || ''
    },
    validate: (values) => {
      const errors: Partial<Record<keyof Property, string>> = {};
      if (!values.name || !values.name.trim()) {
        errors.name = 'Nome obbligatorio';
      }
      if (!values.type) {
        errors.type = 'Tipo obbligatorio';
      }
      if (!values.status) {
        errors.status = 'Stato obbligatorio';
      }
      if (values.size && (isNaN(Number(values.size)) || Number(values.size) < 0)) {
        errors.size = 'Superficie non valida';
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
      <Input
        label="Nome"
        name="name"
        required
        {...form.getFieldProps('name')}
      />
      <Input
        label="Indirizzo"
        name="address"
        {...form.getFieldProps('address')}
      />
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
        label="Superficie (mq)"
        name="size"
        type="number"
        {...form.getFieldProps('size')}
      />
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