import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Contact } from '../types/entities/contact';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getContatti();
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
      setError('contacts.errors.load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = async (newContact: Contact) => {
    try {
      const createdContact = await apiService.createContatto(newContact);
      setContacts(prev => [...prev, createdContact]);
    } catch (error) {
      console.error('Error creating contact:', error);
      setError('contacts.errors.create');
    }
  };

  const updateContact = async (id: string, updatedContact: Contact) => {
    try {
      await apiService.updateContatto(id, updatedContact);
      setContacts(prev => prev.map(c => (c.id === id ? updatedContact : c)));
    } catch (error) {
      console.error('Error updating contact:', error);
      setError('contacts.errors.update');
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await apiService.deleteContatto(id);
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('contacts.errors.delete');
    }
  };

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
};