import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Event } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
      setError('events.errors.load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const createEvent = async (newEvent: Event) => {
    try {
      const createdEvent = await apiService.createEvent(newEvent);
      setEvents(prev => [...prev, createdEvent]);
    } catch (error) {
      console.error('Error creating event:', error);
      setError('events.errors.create');
    }
  };

  const updateEvent = async (id: string, updatedEvent: Event) => {
    try {
      await apiService.updateEvent(id, updatedEvent);
      setEvents(prev => prev.map(e => (e.id === id ? updatedEvent : e)));
    } catch (error) {
      console.error('Error updating event:', error);
      setError('events.errors.update');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await apiService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      setError('events.errors.delete');
    }
  };

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};