import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { Input, Select, Button } from '../../../components/ui';
import type { Deadline, DeadlinePriority } from '../../../types';

interface DeadlineFormProps {
  initialData?: Partial<Deadline>;
  onSubmit: (data: Partial<Deadline>) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

const priorityOptions = [
  { value: 'low', label: 'Bassa' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' }
];

const categoryOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'casa', label: 'Casa' },
  { value: 'condominio', label: 'Condominio' },
  { value: 'redditi', label: 'Redditi' },
  { value: 'documenti', label: 'Documenti' },
  { value: 'salute', label: 'Salute' },
  { value: 'spese', label: 'Spese Domestiche' },
  { value: 'altro', label: 'Altro' }
];

export const DeadlineForm: React.FC<DeadlineFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const form = useForm<Partial<Deadline>>({
    initialValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      dueDate: initialData?.dueDate || new Date().toISOString().split('T')[0],
      priority: initialData?.priority || 'medium',
      category: initialData?.category || '',
      tags: initialData?.tags || [],
      isCompleted: initialData?.isCompleted || false
    },
    validate: (values) => {
      const errors: Partial<Record<keyof Deadline, string>> = {};
      if (!values.title || !values.title.trim()) {
        errors.title = 'Titolo obbligatorio';
      }
      if (!values.dueDate) {
        errors.dueDate = 'Data di scadenza obbligatoria';
      }
      if (!values.priority) {
        errors.priority = 'Priorità obbligatoria';
      }
      return errors;
    },
    onSubmit: async (values) => {
      await onSubmit(values);
    }
  });

  // Handle tags input
  const [tagInput, setTagInput] = React.useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !form.values.tags?.includes(tagInput.trim())) {
      form.setFieldValue('tags', [...(form.values.tags || []), tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    form.setFieldValue('tags', form.values.tags?.filter(t => t !== tag) || []);
  };

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <Input
        label="Titolo"
        name="title"
        required
        {...form.getFieldProps('title')}
      />
      <Input
        label="Descrizione"
        name="description"
        multiline
        {...form.getFieldProps('description')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Data di scadenza"
          name="dueDate"
          type="date"
          required
          {...form.getFieldProps('dueDate')}
        />
        <Select
          label="Priorità"
          name="priority"
          options={priorityOptions}
          required
          {...form.getFieldProps('priority')}
        />
      </div>
      <Select
        label="Categoria"
        name="category"
        options={categoryOptions}
        {...form.getFieldProps('category')}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Frequenza"
          name="frequency"
          placeholder="es. annuale, semestrale, ogni 2 anni"
          {...form.getFieldProps('frequency')}
        />
        <Input
          label="Prossima Scadenza"
          name="nextDeadline"
          type="date"
          {...form.getFieldProps('nextDeadline')}
        />
      </div>
      
      <Input
        label="Note e Documenti"
        name="notes"
        multiline
        placeholder="Descrizione dettagliata e link ai documenti necessari"
        {...form.getFieldProps('notes')}
      />
      
      {/* Tags section */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
          Tag
        </label>
        <div className="flex">
          <Input
            name="tagInput"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Aggiungi un tag"
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleAddTag} 
            className="ml-2"
          >
            Aggiungi
          </Button>
        </div>
        
        {form.values.tags && form.values.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.values.tags.map((tag) => (
              <div 
                key={tag} 
                className="flex items-center bg-background-light dark:bg-background-dark px-3 py-1 rounded-full text-sm"
              >
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {isEdit && (
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isCompleted"
            checked={form.values.isCompleted}
            onChange={(e) => form.setFieldValue('isCompleted', e.target.checked)}
            className="mr-2 h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark rounded"
          />
          <label htmlFor="isCompleted" className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
            Completata
          </label>
        </div>
      )}
      
      <div className="flex space-x-2 pt-2">
        <Button type="submit">{isEdit ? 'Salva Modifiche' : 'Aggiungi'}</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>Annulla</Button>
        )}
      </div>
    </form>
  );
};
