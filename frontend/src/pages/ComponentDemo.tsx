import { useState } from 'react';
import { Plus, Edit, Trash2, Heart, Settings } from 'lucide-react';
import { Button, Input, Select, Modal } from '../components/ui';
import { useModal } from '../hooks/useModal';
import { useToastContext } from '../context/ToastContext';
import { ExpenseForm } from '../components/forms/ExpenseForm';
import { AddExpenseModal } from '../components/modals/AddExpenseModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';
import { useLanguage } from '../context/LanguageContext';

const ComponentDemo = () => {
  const { t } = useLanguage();
  const { success, error, warning, info } = useToastContext();
  const demoModal = useModal();
  const expenseModal = useModal();
  const deleteModal = useModal();
  
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [inputError, setInputError] = useState('');

  const options = [
    { value: 'option1', label: t('componentDemo.formControls.selectBase.options.option1') },
    { value: 'option2', label: t('componentDemo.formControls.selectBase.options.option2') },
    { value: 'option3', label: t('componentDemo.formControls.selectBase.options.option3') }
  ];

  const handleFormSubmit = async (data: any) => {
    console.log('Form submitted:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    success(t('componentDemo.forms.submitSuccess'));
  };

  const handleToastTest = (type: string) => {
    switch (type) {
      case 'success':
        success(t('componentDemo.toastNotifications.messages.success'));
        break;
      case 'error':
        error(t('componentDemo.toastNotifications.messages.error'));
        break;
      case 'warning':
        warning(t('componentDemo.toastNotifications.messages.warning'));
        break;
      case 'info':
        info(t('componentDemo.toastNotifications.messages.info'));
        break;
    }
  };

  const validateInput = (value: string) => {
    if (value.length < 3) {
      setInputError(t('componentDemo.formControls.inputBase.validationError'));
    } else {
      setInputError('');
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2">
          {t('componentDemo.title')}
        </h1>
        <p className="text-text-secondary-light dark:text-text-secondary-dark">
          {t('componentDemo.subtitle')}
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('componentDemo.buttons.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Variants */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {t('componentDemo.buttons.variants')}
            </h3>
            <div className="space-y-2">
              <Button variant="primary">{t('componentDemo.buttons.primary')}</Button>
              <Button variant="secondary">{t('componentDemo.buttons.secondary')}</Button>
              <Button variant="danger">{t('componentDemo.buttons.danger')}</Button>
              <Button variant="outline">{t('componentDemo.buttons.outline')}</Button>
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {t('componentDemo.buttons.sizes')}
            </h3>
            <div className="space-y-2">
              <Button size="sm">{t('componentDemo.buttons.small')}</Button>
              <Button size="md">{t('componentDemo.buttons.medium')}</Button>
              <Button size="lg">{t('componentDemo.buttons.large')}</Button>
            </div>
          </div>

          {/* With Icons */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {t('componentDemo.buttons.withIcons')}
            </h3>
            <div className="space-y-2">
              <Button icon={Plus}>{t('componentDemo.buttons.addNew')}</Button>
              <Button icon={Edit} variant="outline">{t('common.edit')}</Button>
              <Button icon={Trash2} variant="danger">{t('common.delete')}</Button>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
              {t('componentDemo.buttons.states')}
            </h3>
            <div className="space-y-2">
              <Button disabled>{t('componentDemo.buttons.disabled')}</Button>
              <Button loading>{t('componentDemo.buttons.loading')}</Button>
              <Button icon={Heart} loading>{t('componentDemo.buttons.loadingWithIcon')}</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('componentDemo.formControls.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label={t('componentDemo.formControls.inputBase.label')}
              placeholder={t('componentDemo.formControls.inputBase.placeholder')}
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                validateInput(e.target.value);
              }}
              error={inputError}
              helperText={t('componentDemo.formControls.inputBase.helperText')}
            />

            <Input
              label={t('componentDemo.formControls.inputWithIcon.label')}
              icon={Settings}
              placeholder={t('componentDemo.formControls.inputWithIcon.placeholder')}
            />

            <Input
              label={t('componentDemo.formControls.inputRequired.label')}
              placeholder={t('componentDemo.formControls.inputRequired.placeholder')}
              required
            />

            <Input
              label={t('componentDemo.formControls.inputWithError.label')}
              value={t('componentDemo.formControls.inputWithError.value')}
              error={t('componentDemo.formControls.inputWithError.error')}
            />
          </div>

          <div className="space-y-4">
            <Select
              label={t('componentDemo.formControls.selectBase.label')}
              options={options}
              value={selectValue}
              onChange={(e) => setSelectValue(e.target.value)}
              placeholder={t('componentDemo.formControls.selectBase.placeholder')}
            />

            <Select
              label={t('componentDemo.formControls.selectRequired.label')}
              options={options}
              required
            />

            <Select
              label={t('componentDemo.formControls.selectWithError.label')}
              options={options}
              error={t('componentDemo.formControls.selectWithError.error')}
            />

            <Input
              label={t('componentDemo.formControls.inputDisabled.label')}
              value={t('componentDemo.formControls.inputDisabled.value')}
              disabled
            />
          </div>
        </div>
      </section>

      {/* Toast Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('componentDemo.toastNotifications.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="primary" 
            onClick={() => handleToastTest('success')}>{t('componentDemo.toastNotifications.success')}</Button>
          <Button 
            variant="danger" 
            onClick={() => handleToastTest('error')}>{t('componentDemo.toastNotifications.error')}</Button>
          <Button 
            variant="secondary" 
            onClick={() => handleToastTest('warning')}>{t('componentDemo.toastNotifications.warning')}</Button>
          <Button 
            variant="outline" 
            onClick={() => handleToastTest('info')}>{t('componentDemo.toastNotifications.info')}</Button>
        </div>
      </section>

      {/* Modals Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('componentDemo.modals.title')}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={demoModal.open}>{t('componentDemo.modals.openDemoModal')}</Button>
          <Button onClick={expenseModal.open}>{t('componentDemo.modals.openExpenseModal')}</Button>
          <Button onClick={deleteModal.open} variant="danger">{t('componentDemo.modals.openDeleteModal')}</Button>
        </div>

        <Modal
          isOpen={demoModal.isOpen}
          onClose={demoModal.close}
          title={t('componentDemo.modals.demoModal.title')}
          description={t('componentDemo.modals.demoModal.description')}
        >
          <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
            {t('componentDemo.modals.demoModal.content')}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={demoModal.close}>{t('common.cancel')}</Button>
            <Button onClick={demoModal.close}>{t('common.save')}</Button>
          </div>
        </Modal>

        <AddExpenseModal
          isOpen={expenseModal.isOpen}
          onClose={expenseModal.close}
          onSave={handleFormSubmit}
        />

        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onConfirm={() => {
            success(t('componentDemo.modals.deleteModal.confirmMessage'));
            deleteModal.close();
          }}
          title={t('componentDemo.modals.deleteModal.title')}
          message={t('componentDemo.modals.deleteModal.message')}
        />
      </section>

      {/* Form Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-text-primary-light dark:text-text-primary-dark">
          {t('componentDemo.forms.title')}
        </h2>
        <ExpenseForm onSubmit={handleFormSubmit} />
      </section>
    </div>
  );
};

export default ComponentDemo;