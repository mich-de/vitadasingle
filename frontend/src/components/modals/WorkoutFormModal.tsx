import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import type { Workout, WorkoutType, WorkoutIntensity } from '../../types/entities/workout';
import { useLanguage } from '../../context/LanguageContext';

interface WorkoutFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: Workout) => void;
  workout?: Workout;
  isEditing?: boolean;
}

const WorkoutFormModal: React.FC<WorkoutFormModalProps> = ({ isOpen, onClose, onSave, workout, isEditing = false }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Workout>>({
    name: '',
    type: 'strength',
    duration: 30,
    intensity: 'moderate',
    calories: 0,
    exercises: [],
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newExercise, setNewExercise] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workout && isOpen) {
      setFormData({
        ...workout,
        date: new Date(workout.date).toISOString().split('T')[0]
      });
    } else if (!isEditing && isOpen) {
      setFormData({
        name: '',
        type: 'strength',
        duration: 30,
        intensity: 'moderate',
        calories: 0,
        exercises: [],
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
    setErrors({});
  }, [workout, isOpen, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'calories' ? parseInt(value) || 0 : value
    }));
  };

  const addExercise = () => {
    if (newExercise.trim()) {
      setFormData(prev => ({
        ...prev,
        exercises: [...(prev.exercises || []), newExercise.trim()]
      }));
      setNewExercise('');
    }
  };

  const removeExercise = (index: number) => {
    setFormData(prev => ({
      ...prev,
      exercises: prev.exercises?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = t('workouts.errors.nameRequired');
    }
    if (!formData.date) {
      newErrors.date = t('workouts.errors.dateRequired');
    }
    if (formData.duration && formData.duration <= 0) {
      newErrors.duration = t('workouts.errors.durationPositive');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData as Workout);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t('workouts.editWorkout') : t('workouts.addWorkout')}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? t('common.save') : t('common.add')}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('workouts.name')} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.name ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('workouts.type.label')}
            </label>
            <select
              id="type"
              name="type"
              value={formData.type || 'strength'}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="strength">{t('workouts.type.strength')}</option>
              <option value="cardio">{t('workouts.type.cardio')}</option>
              <option value="flexibility">{t('workouts.type.flexibility')}</option>
              <option value="sports">{t('workouts.type.sports')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="intensity" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('workouts.intensity.label')}
            </label>
            <select
              id="intensity"
              name="intensity"
              value={formData.intensity || 'moderate'}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            >
              <option value="low">{t('workouts.intensity.low')}</option>
              <option value="moderate">{t('workouts.intensity.moderate')}</option>
              <option value="high">{t('workouts.intensity.high')}</option>
              <option value="extreme">{t('workouts.intensity.extreme')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('workouts.duration')} (min) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration || ''}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.duration ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
            />
            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
          </div>

          <div>
            <label htmlFor="calories" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
              {t('workouts.calories')}
            </label>
            <input
              type="number"
              id="calories"
              name="calories"
              min="0"
              value={formData.calories || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
            />
          </div>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('workouts.date')} *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-background-light dark:bg-background-dark border ${errors.date ? 'border-red-500' : 'border-border-light dark:border-border-dark'} rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark`}
          />
          {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('workouts.exercises')}
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newExercise}
              onChange={(e) => setNewExercise(e.target.value)}
              placeholder={t('workouts.addExercise')}
              className="flex-1 px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExercise())}
            />
            <Button type="button" onClick={addExercise} size="sm">
              {t('common.add')}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.exercises?.map((exercise, index) => (
              <div key={index} className="flex items-center gap-1 px-3 py-1 bg-background-light dark:bg-background-dark rounded-full border border-border-light dark:border-border-dark">
                <span className="text-sm">{exercise}</span>
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500 dark:hover:text-red-400 ml-1"
                >
                  ×
                </button>
              </div>
            ))}
            {formData.exercises?.length === 0 && (
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                {t('workouts.noExercises')}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
            {t('workouts.notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            value={formData.notes || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark outline-none text-text-primary-light dark:text-text-primary-dark"
          />
        </div>
      </form>
    </Modal>
  );
};

export default WorkoutFormModal;