import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Event } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (newEvent: Event) => void;
  onEventUpdated: (updatedEvent: Event) => void;
  event: Event | null;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventAdded, onEventUpdated, event }) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('personal');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setStartDate(event.startDate);
      setLocation(event.location || '');
      setCategory(event.category);
      setDescription(event.description || '');
    } else {
      setTitle('');
      setStartDate('');
      setLocation('');
      setCategory('personal');
      setDescription('');
    }
  }, [event]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const eventData = {
      id: event?.id,
      title,
      startDate,
      location,
      category,
      description,
    };

    try {
      if (event) {
        // @ts-ignore
        onEventUpdated(eventData);
      } else {
        // @ts-ignore
        onEventAdded(eventData);
      }
      onClose();
    } catch (err) {
      setError(t('events.errors.save'));
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">
          {event ? t('events.editTitle') : t('events.addNew')}
        </h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('events.form.title')}</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" required />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('events.form.startDate')}</label>
            <input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('events.form.location')}</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('events.form.category')}</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50">
              <option value="personal">{t('categories.personal')}</option>
              <option value="work">{t('categories.work')}</option>
              <option value="health">{t('categories.health')}</option>
              <option value="social">{t('categories.social')}</option>
              <option value="travel">{t('categories.travel')}</option>
              <option value="other">{t('categories.other')}</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">{t('events.form.description')}</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-primary-light dark:text-text-primary-dark bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 border border-border-light dark:border-border-dark">{t('common.cancel')}</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 disabled:opacity-50">
              {isSaving ? t('common.saving') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
