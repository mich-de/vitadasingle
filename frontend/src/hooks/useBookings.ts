import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Booking } from '../types/entities/booking';
import { useProperties } from './useProperties';

export const useBookings = () => {
  const { properties } = useProperties();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getBookings();
      const bookingsWithPropertyDetails = data.map((booking: Booking) => {
        const property = properties.find(p => p.id === booking.propertyId);
        return {
          ...booking,
          propertyName: property ? property.name : 'Unknown Property',
          propertyType: property ? property.type : 'unknown'
        };
      });
      setBookings(bookingsWithPropertyDetails);
    } catch (error) {
      console.error('Error loading bookings:', error);
      setError('bookings.errors.load');
    } finally {
      setLoading(false);
    }
  }, [properties]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const createBooking = async (newBooking: Booking) => {
    try {
      const createdBooking = await apiService.createBooking(newBooking);
      setBookings([...bookings, createdBooking]);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError('bookings.errors.create');
    }
  };

  const updateBooking = async (updatedBooking: Booking) => {
    try {
      await apiService.updateBooking(updatedBooking.id, updatedBooking);
      setBookings(bookings.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('bookings.errors.update');
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await apiService.deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('bookings.errors.delete');
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking,
    updateBooking,
    deleteBooking,
  };
};