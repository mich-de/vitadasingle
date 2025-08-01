import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Property, CreatePropertyInput, UpdatePropertyInput } from "../types/entities/property";
import { v4 as uuidv4 } from 'uuid';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Errore caricamento proprietà:', error);
      setError('properties.errors.load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const addProperty = async (propertyData: CreatePropertyInput) => {
    try {
      const newProperty: Property = {
        ...propertyData,
        id: uuidv4(),
        userId: 'current-user', // This would normally come from auth context
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const createdProperty = await apiService.createProperty(newProperty);
      setProperties(prev => [...prev, createdProperty]);
      return createdProperty;
    } catch (error) {
      console.error('Error creating property:', error);
      setError('properties.errors.create');
      throw error;
    }
  };

  const updateProperty = async (id: string, propertyData: UpdatePropertyInput) => {
    try {
      const updatedProperty = await apiService.updateProperty(id, propertyData);
      setProperties(prev => 
        prev.map(p => p.id === id ? { ...p, ...updatedProperty } : p)
      );
      return updatedProperty;
    } catch (error) {
      console.error('Error updating property:', error);
      setError('properties.errors.update');
      throw error;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await apiService.deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting property:', error);
      setError('properties.errors.delete');
      throw error;
    }
  };

  return {
    properties,
    loading,
    error,
    fetchProperties,
    addProperty,
    updateProperty,
    deleteProperty,
  };
};

