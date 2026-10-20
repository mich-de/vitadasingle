import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Dumbbell, Clock, Flame, Target, TrendingUp, Calendar, Plus, Play } from 'lucide-react';
import { apiService } from '../services/apiService';
import WorkoutFormModal from '../components/modals/WorkoutFormModal';
import type { Workout, WorkoutType, WorkoutIntensity } from '../types/entities/workout';

const Workouts = () => {
  const { t } = useLanguage();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getWorkouts();
      setWorkouts(data);
    } catch (error) {
      console.error(t('workouts.errorLoading'), error);
      setError(t('workouts.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const createWorkout = async (newWorkout: Workout) => {
    try {
      const createdWorkout = await apiService.createWorkout(newWorkout);
      setWorkouts([...workouts, createdWorkout]);
    } catch (error) {
      console.error('Errore creazione allenamento:', error);
      setError(t('workouts.errorCreating'));
    }
  };

  const updateWorkout = async (id: string, updatedWorkout: Workout) => {
    try {
      await apiService.updateWorkout(id, updatedWorkout);
      setWorkouts(workouts.map(w => (w.id === id ? updatedWorkout : w)));
    } catch (error) {
      console.error('Errore aggiornamento allenamento:', error);
      setError(t('workouts.errorUpdating'));
    }
  };

  const deleteWorkout = async (id: string) => {
    if (!confirm(t('workouts.confirmDelete'))) return;
    try {
      await apiService.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      console.error(t('workouts.errorDeleting'), error);
      setError(t('workouts.errorDeleting'));
    }
  };

  const handleAddWorkout = () => {
    setSelectedWorkout(undefined);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEditWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSaveWorkout = (workout: Workout) => {
    if (isEditing && selectedWorkout) {
      updateWorkout(selectedWorkout.id, { ...workout, id: selectedWorkout.id });
    } else {
      createWorkout(workout);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dates.locale'), {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'strength': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'cardio': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'flexibility': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'sports': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'extreme': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    return workout.type === filter;
  });

  const weeklyStats = {
    totalWorkouts: workouts.length,
    totalTime: workouts.reduce((sum, workout) => sum + workout.duration, 0),
    avgDuration: workouts.length > 0 ? workouts.reduce((sum, workout) => sum + workout.duration, 0) / workouts.length : 0,
    caloriesBurned: workouts.reduce((sum, workout) => sum + workout.calories, 0)
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('workouts.loading')}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span>{error}</span>
        </div>
        <button 
          onClick={fetchWorkouts}
          className="mt-4 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded hover:opacity-90"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('workouts.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('workouts.dataSource') }}
          ></p>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary-light dark:bg-secondary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
              <Play size={16} />
              {t('workouts.startWorkout')}
            </button>
            <button 
              onClick={handleAddWorkout}
              className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
              <Plus size={16} />
              {t('workouts.addNew')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.totalWorkouts')}
                </p>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {weeklyStats.totalWorkouts}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.thisWeek')}
                </p>
              </div>
              <Dumbbell className="text-blue-500" size={24} />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.totalTime')}
                </p>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {Math.floor(weeklyStats.totalTime / 60)}h {weeklyStats.totalTime % 60}m
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.avgDuration')}: {Math.round(weeklyStats.avgDuration)}min
                </p>
              </div>
              <Clock className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.caloriesBurned')}
                </p>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  {weeklyStats.caloriesBurned.toLocaleString()}
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.thisWeek')}
                </p>
              </div>
              <Flame className="text-red-500" size={24} />
            </div>
          </div>

          <div className="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.progress')}
                </p>
                <p className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
                  +12%
                </p>
                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                  {t('workouts.vsLastWeek')}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={24} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'strength', 'cardio', 'flexibility', 'sports'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === type
                  ? 'bg-primary-light dark:bg-primary-dark text-white'
                  : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-card-light dark:hover:bg-card-dark'
              }`}
            >
              {type === 'all' ? t('workouts.all') : t(`workouts.type.${type}`)}
            </button>
          ))}
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              {t('workouts.recent')}
            </h2>
          </div>
          <div className="divide-y divide-border-light/30 dark:divide-border-dark/30">
            {filteredWorkouts.map((workout) => (
              <div key={workout.id} className="p-6 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {workout.name}
                      </h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(workout.type)}`}>
                          {t(`workouts.type.${workout.type}`)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getIntensityColor(workout.intensity)}`}>
                          {t(`workouts.intensity.${workout.intensity}`)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{formatDate(workout.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame size={16} />
                        <span>{workout.calories} cal</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-1">
                        {t('workouts.exercises')}:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {workout.exercises.map((exercise, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-background-light dark:bg-background-dark text-xs rounded border border-border-light dark:border-border-dark"
                          >
                            {exercise}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {workout.notes && (
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark italic">
                        {t('workouts.notes')}: {workout.notes}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-white text-sm rounded hover:opacity-90">
                      {t('workouts.viewDetails')}
                    </button>
                    <button 
                      onClick={() => handleEditWorkout(workout)}
                      className="px-3 py-1 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark text-sm rounded border border-border-light dark:border-border-dark hover:bg-card-light dark:hover:bg-card-dark">
                      {t('common.edit')}
                    </button>
                    <button 
                      onClick={() => deleteWorkout(workout.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:opacity-90">
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WorkoutFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveWorkout}
        workout={selectedWorkout}
        isEditing={isEditing}
      />
    </>
  );
};

export default Workouts;