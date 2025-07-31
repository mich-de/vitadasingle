import { useState, useEffect } from 'react';
import type { Profile } from '../types';
import { useToast } from './useToast';
import { useLanguage } from '../context/LanguageContext';
import { ApiService } from '../services/apiService';

const apiService = new ApiService();

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { t } = useLanguage();

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError(t('profile.fetchError'));
      showToast('error', t('profile.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData: Partial<Profile>) => {
    if (!profile) return;
    
    setSaving(true);
    setError(null);
    
    try {
      const updatedProfile = await apiService.updateProfile(updatedData);
      setProfile(updatedProfile);
      showToast('success', t('profile.saveSuccess'));
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(t('profile.saveError'));
      showToast('error', t('profile.saveError'));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { 
    profile, 
    loading, 
    saving,
    error, 
    fetchProfile, 
    updateProfile,
  };
};
