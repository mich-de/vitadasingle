import React, { useState } from 'react';
import { X } from 'lucide-react';
import { apiService } from '../../services/apiService';
import type { Event } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (newEvent: Event) => void;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('personal');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const newEventData = {
      title,
      date,
      time,
      location,
      category,
      description,
      participants: [],
      status: 'confirmed',
    };

    try {
      const savedEvent = await apiService.addEvento(newEventData);
      onEventAdded(savedEvent);
      onClose();
    } catch (err) {
      setError('Impossibile salvare l\'evento. Riprova.');
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
        <h2 className="text-2xl font-bold mb-4 text-text-primary-light dark:text-text-primary-dark">{t('events.addNew')}</h2>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Titolo</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Data</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" required />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Ora</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" required />
            </div>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Luogo</label>
            <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Categoria</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50">
              <option value="personal">Personale</option>
              <option value="work">Lavoro</option>
              <option value="health">Salute</option>
              <option value="social">Sociale</option>
              <option value="travel">Viaggio</option>
              <option value="other">Altro</option>
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Descrizione</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 block w-full rounded-md bg-background-light dark:bg-background-dark border-border-light dark:border-border-dark shadow-sm focus:border-primary-light focus:ring focus:ring-primary-light focus:ring-opacity-50"></textarea>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md text-text-primary-light dark:text-text-primary-dark bg-background-light dark:bg-background-dark hover:bg-gray-200 dark:hover:bg-gray-700 border border-border-light dark:border-border-dark">Annulla</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 rounded-md text-white bg-primary-light dark:bg-primary-dark hover:opacity-90 disabled:opacity-50">
              {isSaving ? 'Salvataggio...' : 'Salva Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};