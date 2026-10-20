import React from 'react';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseHeader } from './components/ExpenseHeader';
import { ExpenseList } from './components/ExpenseList';
import { AddExpenseModal } from '../../components/modals/AddExpenseModal';
import { ConfirmDeleteModal } from '../../components/modals/ConfirmDeleteModal';
import { formatCurrency, formatDate, getCategoryLabel } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

const ExpensesPage: React.FC = () => {
  const { t } = useLanguage();
  const {
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
  } = useExpenses();

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('expenses.loading')}
        </span>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span>{errorMsg}</span>
        </div>
        <button 
          onClick={fetchExpenses}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ExpenseHeader 
        onAddExpense={handleAddExpense} 
        totalAmount={totalAmount} 
        formatCurrency={formatCurrency} 
      />
      <ExpenseList 
        expenses={expenses} 
        onEdit={handleEditExpense} 
        onDelete={handleDeleteExpense} 
        formatCurrency={formatCurrency} 
        formatDate={formatDate} 
        getCategoryLabel={getCategoryLabel} 
      />

      {addModal.isOpen && (
        <AddExpenseModal
          isOpen={addModal.isOpen}
          onClose={addModal.closeModal}
          onSuccess={handleExpenseSuccess}
          expenseToEdit={null}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <AddExpenseModal
          isOpen={editModal.isOpen}
          onClose={editModal.closeModal}
          onSuccess={handleExpenseSuccess}
          expenseToEdit={editModal.data}
        />
      )}

      {deleteModal.isOpen && deleteModal.data && (
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.closeModal}
          onConfirm={confirmDelete}
          title={t('expenses.delete')}
          description={t('expenses.confirmDelete', { description: deleteModal.data.description || formatCurrency(deleteModal.data.amount) })}
          itemType={t('expenses.itemType')}
        />
      )}
    </div>
  );
};

export default ExpensesPage;