import { useState } from 'react';
import { useDeadlines } from '../hooks/useDeadlines';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import DeadlineFormModal from '../components/modals/DeadlineFormModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import type { Deadline, CreateDeadlineInput, UpdateDeadlineInput } from '../types';
import { PlusCircle, Edit, Trash2, CalendarCheck, AlertTriangle, CheckCircle } from 'lucide-react';

const DeadlinesPage = () => {
  const { t } = useLanguage();
  const { deadlines, loading, error, addDeadline, updateDeadline, deleteDeadline, toggleDeadlineCompletion } = useDeadlines();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeadline, setSelectedDeadline] = useState<Deadline | null>(null);

  const handleAddClick = () => {
    setSelectedDeadline(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (deadline: Deadline) => {
    setSelectedDeadline(deadline);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeadline) {
      await deleteDeadline(selectedDeadline.id);
      setIsDeleteModalOpen(false);
      setSelectedDeadline(null);
    }
  };

  const handleSaveDeadline = async (data: CreateDeadlineInput | UpdateDeadlineInput) => {
    if (selectedDeadline) {
      await updateDeadline(selectedDeadline.id, data as UpdateDeadlineInput);
    } else {
      await addDeadline(data as CreateDeadlineInput);
    }
    setIsFormModalOpen(false);
    setSelectedDeadline(null);
  };

  const getDaysRemaining = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dates.locale'), {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{t(error)}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('deadlines.title')}</h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('deadlines.dataSource') }}
          ></p>
        </div>
        <Button onClick={handleAddClick}><PlusCircle className="mr-2" size={18} />{t('deadlines.addNew')}</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('deadlines.summary.totalDeadlines')}
          </h3>
          <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {deadlines.length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('deadlines.summary.completed')}
          </h3>
          <p className="text-2xl font-bold text-green-500">
            {deadlines.filter(d => d.isCompleted).length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('deadlines.summary.overdueCount')}
          </h3>
          <p className="text-2xl font-bold text-red-500">
            {deadlines.filter(d => !d.isCompleted && getDaysRemaining(d.dueDate) < 0).length}
          </p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark p-4 rounded-lg shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-light dark:border-border-dark">
                <th className="p-3">{t('deadlines.table.status')}</th>
                <th className="p-3">{t('deadlines.table.title')}</th>
                <th className="p-3">{t('deadlines.table.dueDate')}</th>
                <th className="p-3">{t('deadlines.table.remainingTime')}</th>
                <th className="p-3 text-right">{t('deadlines.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {deadlines.map((deadline) => {
                const daysRemaining = getDaysRemaining(deadline.dueDate);
                let urgencyColor = 'text-green-500';
                if (daysRemaining <= 7 && daysRemaining > 3) urgencyColor = 'text-yellow-500';
                if (daysRemaining <= 3) urgencyColor = 'text-red-500';

                return (
                  <tr key={deadline.id} className="border-b border-border-light/50 dark:border-border-dark/50 hover:bg-background-light dark:hover:bg-background-dark">
                    <td className="p-3">
                      <Button variant="outline" size="sm" onClick={() => toggleDeadlineCompletion(deadline.id, !deadline.isCompleted)}>
                        {deadline.isCompleted ? <CheckCircle className="text-green-500" /> : <CalendarCheck />}
                      </Button>
                    </td>
                    <td className="p-3">
                      <div className="font-medium">{deadline.title}</div>
                      <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{t(`deadlines.category.${deadline.category}`)}</div>
                    </td>
                    <td className="p-3">{formatDate(deadline.dueDate)}</td>
                    <td className={`p-3 font-medium ${urgencyColor}`}>
                      {daysRemaining < 0 ? <div className='flex items-center'><AlertTriangle className='mr-2'/> {t('deadlines.overdue')}</div> : `${daysRemaining} ${t('deadlines.days')}`}
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(deadline)}><Edit size={18} /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteClick(deadline)} className="text-red-500"><Trash2 size={18} /></Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isFormModalOpen && (
        <DeadlineFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSave={handleSaveDeadline}
          deadline={selectedDeadline || undefined}
          isEditing={!!selectedDeadline}
        />
      )}

      {isDeleteModalOpen && selectedDeadline && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title={t('deadlines.deleteModal.title', { title: selectedDeadline.title })}
          message={t('deadlines.deleteModal.message')}
        />
      )}
    </div>
  );
};

export default DeadlinesPage;
