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
      
      const data = await apiService.getExpenses();
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
      await apiService.deleteExpense(deleteModal.data.id);
      setExpenses(prev => prev.filter(exp => exp.id !== deleteModal.data?.id));
      deleteModal.closeModal();
      success(t('expenses.deleteSuccess'));
    } catch (err) {
      console.error('Error deleting expense:', err);
      error(t('expenses.errors.delete'));
    }
  };

  const handleSaveExpense = async (expenseData: Expense) => {
    try {
      if (editModal.data) {
        await apiService.updateExpense(editModal.data.id, expenseData);
        setExpenses(prev => prev.map(exp => exp.id === editModal.data?.id ? expenseData : exp));
        success(t('expenses.editSuccess'));
      } else {
        const newExpense = await apiService.createExpense(expenseData);
        setExpenses(prev => [...prev, newExpense]);
        success(t('expenses.addSuccess'));
      }
      addModal.closeModal();
      editModal.closeModal();
    } catch (err) {
      console.error('Error saving expense:', err);
      error(t('expenses.errors.save'));
    }
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
    handleSaveExpense,
  };
};