import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { Document } from '../types/entities/document';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDocumenti();
      setDocuments(data);
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('documents.errors.load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const createDocument = async (newDocument: Document) => {
    try {
      const createdDocument = await apiService.createDocumento(newDocument);
      setDocuments(prev => [...prev, createdDocument]);
    } catch (error) {
      console.error('Error creating document:', error);
      setError('documents.errors.create');
    }
  };

  const updateDocument = async (id: string, updatedDocument: Document) => {
    try {
      await apiService.updateDocumento(id, updatedDocument);
      setDocuments(prev => prev.map(d => (d.id === id ? updatedDocument : d)));
    } catch (error) {
      console.error('Error updating document:', error);
      setError('documents.errors.update');
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await apiService.deleteDocumento(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      setError('documents.errors.delete');
    }
  };

  return {
    documents,
    loading,
    error,
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};