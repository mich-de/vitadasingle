import { useState, useEffect } from 'react';
import { useModal } from '../../../hooks/useModal';
import { apiService } from '../../../services/apiService';
import { useToast } from '../../../hooks/useToast';
import type { Expense } from '../../../types';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const { success, error } = useToast();
  
  // Modal states
  const addModal = useModal();
  const editModal = useModal<Expense>();
  const deleteModal = useModal<Expense>();

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const data = await apiService.getSpese();
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setErrorMsg('expenses.errors.load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = () => {
    addModal.openModal();
  };

  const handleEditExpense = (expense: Expense) => {
    editModal.openModal(expense);
  };

  const handleDeleteExpense = (expense: Expense) => {
    deleteModal.openModal(expense);
  };

  const confirmDelete = async () => {
    if (!deleteModal.data) return;
    
    try {
      await apiService.deleteSpesa(deleteModal.data.id);
      success('expenses.messages.deleteSuccess');
      fetchExpenses();
      deleteModal.closeModal();
    } catch (err) {
      error('expenses.messages.deleteError');
      console.error(err);
    }
  };

  const handleExpenseSuccess = () => {
    fetchExpenses();
    success('expenses.messages.saveSuccess');
  };

  return {
    expenses,
    loading,
    errorMsg,
    addModal,
    editModal,
    deleteModal,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    confirmDelete,
    handleExpenseSuccess,
    fetchExpenses,
  };
};