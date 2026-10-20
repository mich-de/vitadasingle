import React from 'react';
import { useExpenses } from '../features/expenses/hooks/useExpenses';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import { formatCurrency, formatDate, getCategoryLabel } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

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
        <Button 
          onClick={fetchExpenses}
          className="mt-4"
        >
          {t('common.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('expenses.title')}</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('expenses.dataSource') }}
          ></p>
        </div>
        <Button onClick={handleAddExpense}><Plus className="mr-2" size={18} />{t('expenses.addExpense')}</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('expenses.summary.totalExpenses')}
          </h3>
          <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {formatCurrency(totalAmount)}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('expenses.summary.thisMonth')}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('expenses.summary.numberOfExpenses')}
          </h3>
          <p className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">
            {expenses.length}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('expenses.summary.thisMonth')}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('expenses.summary.averageExpense')}
          </h3>
          <p className="text-2xl font-bold text-accent-light dark:text-accent-dark">
            {formatCurrency(expenses.length > 0 ? totalAmount / expenses.length : 0)}
          </p>
          <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('expenses.summary.thisMonth')}
          </p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-3">{t('expenses.table.date')}</th>
                <th className="p-3">{t('expenses.table.category')}</th>
                <th className="p-3">{t('expenses.table.description')}</th>
                <th className="p-3">{t('expenses.table.amount')}</th>
                <th className="p-3 text-right">{t('expenses.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id} className="border-b border-border-light/50 dark:border-border-dark/50 hover:bg-background-light dark:hover:bg-background-dark">
                  <td className="p-3">{formatDate(expense.date)}</td>
                  <td className="p-3">{getCategoryLabel(expense.category)}</td>
                  <td className="p-3">{expense.description}</td>
                  <td className="p-3">{formatCurrency(expense.amount)}</td>
                  <td className="p-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEditExpense(expense)}><Edit size={18} /></Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteExpense(expense)} className="text-red-500"><Trash2 size={18} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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