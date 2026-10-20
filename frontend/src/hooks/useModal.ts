import { useState, useCallback } from 'react';

export function useModal<T>() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const openModal = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setData(null);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setData(null);
    }
  }, [isOpen]);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
    // Helper methods
    setData: useCallback((newData: T) => setData(newData), [])
  };
}
