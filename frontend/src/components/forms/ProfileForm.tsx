import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useLanguage } from '../../context/LanguageContext';
import type { Profile } from '../../types';
import { useProfile } from '../../hooks/useProfile';
import { User, Mail, Phone, MapPin, FileText, RotateCcw } from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export const ProfileForm: React.FC = () => {
  const { t } = useLanguage();
  const { profile, loading, error, updateProfile, resetProfile } = useProfile();
  const [formData, setFormData] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setHasChanges(false);
    }
  }, [profile]);

  const validateForm = (data: Profile): FormErrors => {
    const newErrors: FormErrors = {};

    if (!data.name.trim()) {
      newErrors.name = t('profile.name') + t('common.isRequired');
    } else if (data.name.trim().length < 2) {
      newErrors.name = t('profile.name') + t('common.minCharacters', { count: 2 });
    }

    if (!data.email.trim()) {
      newErrors.email = t('profile.email') + t('common.isRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = t('profile.emailFormatError');
    }

    if (data.phone && !/^[+]?[0-9\s-()]{8,}$/.test(data.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('profile.phoneFormatError');
    }

    if (data.bio && data.bio.length > 500) {
      newErrors.bio = t('profile.bioLengthError');
    }

    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      const newFormData = { ...formData, [name]: value };
      setFormData(newFormData);
      setHasChanges(JSON.stringify(newFormData) !== JSON.stringify(profile));
      
      // Clear specific field error when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSaving(true);
    try {
      await updateProfile(formData);
      setHasChanges(false);
      setErrors({});
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm(t('profile.resetConfirm'))) {
      resetProfile();
      setHasChanges(false);
      setErrors({});
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData(profile);
      setHasChanges(false);
      setErrors({});
    }
  };

  if (loading && !formData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-3 text-text-secondary-light dark:text-text-secondary-dark">
          {t('common.loading')}
        </span>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {t('settings.editProfile')}
          </h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
            {t('profile.updatePersonalInformation')}
          </p>
        </div>
        <Button
          type="button"
          onClick={handleReset}
          variant="outline"
          size="sm"
          icon={RotateCcw}
        >
          Reset
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t('profile.name')}
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t('profile.namePlaceholder')}
          icon={User}
          error={errors.name}
          required
        />
        
        <Input
          label={t('profile.email')}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t('profile.emailPlaceholder')}
          icon={Mail}
          error={errors.email}
          required
        />
        
        <Input
          label={t('profile.phone')}
          name="phone"
          value={formData.phone || ''}
          onChange={handleChange}
          placeholder={t('profile.phonePlaceholder')}
          icon={Phone}
          error={errors.phone}
        />
        
        <Input
          label={t('profile.address')}
          name="address"
          value={formData.address || ''}
          onChange={handleChange}
          placeholder={t('profile.addressPlaceholder')}
          icon={MapPin}
          error={errors.address}
        />
        
        {/* Bio Field */}
        <div className="space-y-1">
          <label 
            htmlFor="bio" 
            className="flex items-center gap-2 text-sm font-medium text-text-primary-light dark:text-text-primary-dark"
          >
            <FileText size={16} className="text-text-secondary-light dark:text-text-secondary-dark" />
            {t('profile.bio')}
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={4}
            value={formData.bio || ''}
            onChange={handleChange}
            placeholder={t('profile.bioPlaceholder')}
            className={`
              w-full px-3 py-2 border rounded-lg transition-colors resize-none
              bg-background-light dark:bg-background-dark
              text-text-primary-light dark:text-text-primary-dark
              placeholder-text-secondary-light dark:placeholder-text-secondary-dark
              focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                errors.bio
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
              }
            `}
          />
          <div className="flex justify-between items-center">
            {errors.bio && (
              <p className="text-sm text-red-500">{errors.bio}</p>
            )}
            <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark ml-auto">
              {formData.bio?.length || 0}/500
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={saving || !hasChanges}
            variant="primary"
            className="flex-1"
          >
            {saving ? t('common.saving') : t('common.save')}
          </Button>
          
          {hasChanges && (
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              disabled={saving}
            >
              {t('common.cancel')}
            </Button>
          )}
        </div>
      </form>

      {/* Changes Indicator */}
      {hasChanges && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            {t('profile.unsavedChanges')}
          </p>
        </div>
      )}
    </div>
  );
};
