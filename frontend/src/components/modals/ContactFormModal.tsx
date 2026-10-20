import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import type { Contact, ContactType } from '../../types/entities/contact';

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact?: Contact;
  isEditing?: boolean;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose, onSave, contact, isEditing = false }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    type: 'altro',
    phone: '',
    email: '',
    address: '',
    notes: '',
    emergency: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (contact && isOpen) {
      setFormData({ ...contact });
    } else if (!isEditing && isOpen) {
      setFormData({
        name: '',
        type: 'altro',
        phone: '',
        email: '',
        address: '',
        notes: '',
        emergency: false
      });
    }
    setErrors({});
  }, [contact, isOpen, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = t('contacts.errors.nameRequired');
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = t('contacts.errors.phoneRequired');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as Contact);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('contacts.editContact') : t('contacts.addContact')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('contacts.name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.name ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('contacts.type')}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type || 'altro'}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="medico">{t('contacts.types.medico')}</option>
              <option value="avvocato">{t('contacts.types.avvocato')}</option>
              <option value="commercialista">{t('contacts.types.commercialista')}</option>
              <option value="assicurazione">{t('contacts.types.assicurazione')}</option>
              <option value="tecnico">{t('contacts.types.tecnico')}</option>
              <option value="emergenza">{t('contacts.types.emergenza')}</option>
              <option value="altro">{t('contacts.types.altro')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('contacts.phone')} *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.phone ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('contacts.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('contacts.address')}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>

        <div className="flex items-center">
            <input
              type="checkbox"
              id="emergency"
              name="emergency"
              checked={formData.emergency || false}
              onChange={handleChange}
              className="h-4 w-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-border-light dark:border-border-dark rounded"
            />
            <label htmlFor="emergency" className="ml-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
              {t('contacts.emergency')}
            </label>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('contacts.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
      </form>
    </Modal>
  );
};

export default ContactFormModal;