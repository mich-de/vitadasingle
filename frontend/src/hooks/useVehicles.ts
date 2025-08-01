import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Vehicle } from '../types/entities/vehicle';

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getVehicles();
      setVehicles(data);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setError('vehicles.errors.load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const createVehicle = async (newVehicle: Vehicle) => {
    try {
      const createdVehicle = await apiService.createVehicle(newVehicle);
      setVehicles(prev => [...prev, createdVehicle]);
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError('vehicles.errors.create');
    }
  };

  const updateVehicle = async (id: string, updatedVehicle: Vehicle) => {
    try {
      await apiService.updateVehicle(id, updatedVehicle);
      setVehicles(prev => prev.map(v => (v.id === id ? updatedVehicle : v)));
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setError('vehicles.errors.update');
    }
  };

  const deleteVehicle = async (id: string) => {
    try {
      await apiService.deleteVehicle(id);
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError('vehicles.errors.delete');
    }
  };

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
};