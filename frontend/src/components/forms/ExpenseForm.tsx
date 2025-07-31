// ExpenseForm component following AI Coding Guidelines
// - All code in English
// - Uses translation keys for UI text
// - ISO 8601 date handling
// - Proper TypeScript types

import React from 'react';
import { DollarSign, FileText, Calendar, CreditCard, Repeat } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { useLanguage } from '../../context/LanguageContext';
import { Input, Select, Button } from '../ui';
import { getCurrentDate, formatDateForDisplay } from '../../utils/dateHelpers';
import { formatCurrency } from '../../utils/formatters';
import type { ExpenseCategory, PaymentMethod, RecurringFrequency, FormOption } from '../../types';

interface ExpenseFormData {
  amount: string;
  description: string;
  category: ExpenseCategory | '';
  paymentMethod: PaymentMethod;
  date: string; // ISO 8601 format (YYYY-MM-DD)
  recurring: boolean;
  frequency?: RecurringFrequency;
}

interface ExpenseFormProps {
  initialData?: Partial<ExpenseFormData>;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel?: () => void;
  isEdit?: boolean;
}

/**
 * ExpenseForm component for creating and editing expenses
 * Follows AI Coding Guidelines with English code and ISO 8601 dates
 */
export const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEdit = false
}) => {
  const { t, language } = useLanguage();
  
  // Category options using translation keys
  const categoryOptions: FormOption[] = [
    { value: 'food', label: t('expenses.category.food') },
    { value: 'transport', label: t('expenses.category.transport') },
    { value: 'utilities', label: t('expenses.category.utilities') },
    { value: 'entertainment', label: t('expenses.category.entertainment') },
    { value: 'health', label: t('expenses.category.health') },
    { value: 'shopping', label: t('expenses.category.shopping') },
    { value: 'education', label: t('expenses.category.education') },
    { value: 'other', label: t('expenses.category.other') }
  ];

  // Payment method options using translation keys
  const paymentMethodOptions: FormOption[] = [
    { value: 'card', label: t('expenses.paymentMethod.card') },
    { value: 'cash', label: t('expenses.paymentMethod.cash') },
    { value: 'transfer', label: t('expenses.paymentMethod.transfer') },
    { value: 'check', label: t('expenses.paymentMethod.check') }
  ];
  
  // Frequency options using translation keys
  const frequencyOptions: FormOption[] = [
    { value: 'daily', label: t('expenses.frequency.daily') },
    { value: 'weekly', label: t('expenses.frequency.weekly') },
    { value: 'monthly', label: t('expenses.frequency.monthly') },
    { value: 'bimonthly', label: t('expenses.frequency.bimonthly') },
    { value: 'quarterly', label: t('expenses.frequency.quarterly') },
    { value: 'yearly', label: t('expenses.frequency.yearly') }
  ];

  const form = useForm<ExpenseFormData>({
    initialValues: {
      amount: initialData?.amount || '',
      description: initialData?.description || '',
      category: initialData?.category || '',
      paymentMethod: initialData?.paymentMethod || 'card',
      date: initialData?.date || getCurrentDate(), // Use ISO 8601 format
      recurring: initialData?.recurring || false,
      frequency: initialData?.frequency
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ExpenseFormData, string>> = {};
      
      // Amount validation
      if (!values.amount.trim()) {
        errors.amount = t('expenses.validation.amountRequired');
      } else {
        const amount = parseFloat(values.amount);
        if (isNaN(amount) || amount <= 0) {
          errors.amount = t('expenses.validation.amountInvalid');
        } else if (amount > 999999) {
          errors.amount = t('expenses.validation.amountTooHigh');
        }
      }
      
      // Category validation
      if (!values.category) {
        errors.category = t('expenses.validation.categoryRequired');
      }
      
      // Date validation
      if (!values.date) {
        errors.date = t('expenses.validation.dateRequired');
      } else {
        const selectedDate = new Date(values.date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        if (selectedDate > today) {
          errors.date = t('expenses.validation.dateFuture');
        } else if (selectedDate < oneYearAgo) {
          errors.date = t('expenses.validation.dateTooOld');
        }
      }
      
      // Description validation
      if (values.description && values.description.length > 500) {
        errors.description = t('expenses.validation.descriptionTooLong');
      }
      
      // Frequency validation
      if (values.recurring && !values.frequency) {
        errors.frequency = t('expenses.validation.frequencyRequired');
      }
      
      return errors;
    },
    onSubmit: async (values) => {
      // Convert amount to number for submission
      const submissionData = {
        ...values,
        amount: parseFloat(values.amount).toFixed(2)
      };
      await onSubmit(submissionData);
    }
  });

  /**
   * Format amount input to ensure proper decimal handling
   */
  const formatAmountInput = (value: string): string => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    
    // Ensure only one decimal point
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return parts[0] + '.' + parts[1].slice(0, 2);
    }
    
    return cleaned;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmountInput(e.target.value);
    form.setValue('amount', formatted);
  };

  /**
   * Get selected category label for display
   */
  const getSelectedCategoryLabel = (): string => {
    const selectedCategory = categoryOptions.find(c => c.value === form.values.category);
    return selectedCategory?.label || t('expenses.validation.categoryNotSelected');
  };

  /**
   * Handle recurring toggle
   */
  const handleRecurringToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isRecurring = e.target.checked;
    form.setValue('recurring', isRecurring);
    
    // Reset frequency if not recurring
    if (!isRecurring) {
      form.setValue('frequency', undefined);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit} className="space-y-4">
        {/* Amount and Category Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label={t('expenses.amount')}
              type="text"
              icon={DollarSign}
              placeholder="0.00"
              required
              value={form.values.amount}
              onChange={handleAmountChange}
              onBlur={() => form.setFieldTouched('amount')}
              error={form.touched.amount ? form.errors.amount : undefined}
              helperText={t('expenses.form.amountHelper')}
            />
          </div>
          
          <div>
            <Select
              label={t('expenses.category')}
              options={categoryOptions}
              placeholder={t('expenses.form.selectCategory')}
              required
              {...form.getFieldProps('category')}
            />
          </div>
        </div>
        
        {/* Description */}
        <div>
          <Input
            label={t('expenses.description')}
            type="text"
            icon={FileText}
            placeholder={t('expenses.form.descriptionPlaceholder')}
            {...form.getFieldProps('description')}
            helperText={`${form.values.description.length}/500 ${t('common.characters')}`}
          />
        </div>
        
        {/* Payment Method and Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label={t('expenses.paymentMethod')}
              options={paymentMethodOptions}
              icon={CreditCard}
              {...form.getFieldProps('paymentMethod')}
            />
          </div>
          
          <div>
            <Input
              label={t('expenses.date')}
              type="date"
              icon={Calendar}
              required
              {...form.getFieldProps('date')}
            />
          </div>
        </div>
        
        {/* Recurring Options */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              className="h-4 w-4 rounded border-gray-300 text-primary-light focus:ring-primary-light dark:border-gray-600 dark:bg-gray-800 dark:text-primary-dark dark:focus:ring-primary-dark"
              checked={form.values.recurring}
              onChange={handleRecurringToggle}
            />
            <label htmlFor="recurring" className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark flex items-center">
              <Repeat className="h-4 w-4 mr-1" />
              {t('expenses.recurring')}
            </label>
          </div>
          
          {form.values.recurring && (
            <div className="pl-6">
              <Select
                label={t('expenses.frequency')}
                options={frequencyOptions}
                placeholder={t('expenses.form.selectFrequency')}
                required={form.values.recurring}
                value={form.values.frequency || ''}
                onChange={(e) => form.setValue('frequency', e.target.value as RecurringFrequency)}
                onBlur={() => form.setFieldTouched('frequency')}
                error={form.touched.frequency ? form.errors.frequency : undefined}
              />
            </div>
          )}
        </div>
        
        {/* Summary if editing */}
        {isEdit && form.values.amount && (
          <div className="p-4 bg-background-light dark:bg-background-dark rounded-lg border border-border-light dark:border-border-dark">
            <h4 className="font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('expenses.form.editSummary')}
            </h4>
            <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark space-y-1">
              <p>
                {t('expenses.amount')}: {formatCurrency(parseFloat(form.values.amount || '0'), language)}
              </p>
              <p>
                {t('expenses.category')}: {getSelectedCategoryLabel()}
              </p>
              <p>
                {t('expenses.date')}: {form.values.date ? formatDateForDisplay(form.values.date, language) : t('expenses.validation.dateNotSpecified')}
              </p>
              {form.values.recurring && (
                <p>
                  {t('expenses.frequency')}: {frequencyOptions.find(f => f.value === form.values.frequency)?.label}
                </p>
              )}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-dark">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={form.isSubmitting}
            >
              {t('common.cancel')}
            </Button>
          )}
          
          <Button
            type="submit"
            loading={form.isSubmitting}
            disabled={form.isSubmitting || !form.isValid}
          >
            {isEdit ? t('expenses.form.updateExpense') : t('expenses.form.createExpense')}
          </Button>
        </div>
      </form>
      
      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <details className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400">
            {t('expenses.form.debugInfo')}
          </summary>
          <div className="mt-2 text-xs font-mono">
            <p><strong>Values:</strong> {JSON.stringify(form.values, null, 2)}</p>
            <p><strong>Errors:</strong> {JSON.stringify(form.errors, null, 2)}</p>
            <p><strong>Touched:</strong> {JSON.stringify(form.touched, null, 2)}</p>
            <p><strong>Is Valid:</strong> {form.isValid.toString()}</p>
            <p><strong>Language:</strong> {language}</p>
          </div>
        </details>
      )}
    </div>
  );
};
