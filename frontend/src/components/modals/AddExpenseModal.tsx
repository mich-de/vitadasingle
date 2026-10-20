import React from 'react';
import { Plus, Edit } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from '../forms/ExpenseForm';
import { useApi } from '../../hooks/useApi';
import { useToast } from '../../hooks/useToast';
import { useLanguage } from '../../context/LanguageContext';
import type { Expense } from '../../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (expense: Expense) => void;
  expenseToEdit?: Expense | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  expenseToEdit
}) => {
  const { post, put } = useApi();
  const { success, error } = useToast();
  const { t } = useLanguage();
  
  const isEdit = !!expenseToEdit;

  const handleSubmit = async (data: any) => {
    try {
      const expenseData = {
        amount: parseFloat(data.amount),
        description: data.description || null,
        category: data.category,
        paymentMethod: data.paymentMethod,
        date: data.date,
        recurring: data.recurring || false,
        frequency: data.recurring ? data.frequency : null
      };

      let response;
      
      if (isEdit && expenseToEdit) {
        response = await put<{ message: string; expense: Expense }>(`/spese/${expenseToEdit.id}`, expenseData);
        success(t('expenses.updateSuccess'));
      } else {
        response = await post<{ message: string; expense: Expense }>('/spese', expenseData);
        success(t('expenses.createSuccess'));
      }

      onSuccess?.(response.expense);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 
        isEdit ? t('expenses.updateError') : t('expenses.createError');
      error(errorMessage);
      throw err; // Re-throw to let form handle it
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? t('expenses.editExpense') : t('expenses.addNew')}
      size="lg"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
            {isEdit ? (
              <Edit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            ) : (
              <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              {isEdit ? t('expenses.editExpense') : t('expenses.addNew')}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-300">
              {isEdit 
                ? t('expenses.form.editDescription')
                : t('expenses.form.addDescription')
              }
            </p>
          </div>
        </div>

        <ExpenseForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          initialData={expenseToEdit ? {
            amount: expenseToEdit.amount.toString(),
            description: expenseToEdit.description || '',
            category: expenseToEdit.category,
            paymentMethod: expenseToEdit.paymentMethod,
            date: expenseToEdit.date,
            recurring: expenseToEdit.recurring || false,
            frequency: expenseToEdit.frequency
          } : undefined}
          isEdit={isEdit}
        />
      </div>
    </Modal>
  );
};