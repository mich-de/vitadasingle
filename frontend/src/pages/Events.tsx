import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useEvents } from '../hooks/useEvents';
import { Calendar, Clock, MapPin, Users, Plus, Bell, Edit, Trash2 } from 'lucide-react';
import type { Event } from '../types';
import { AddEventModal } from '../components/modals/AddEventModal';

const Events = () => {
  const { t } = useLanguage();
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddEvent = () => {
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(t('dates.locale'), {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return today.toDateString() === eventDate.toDateString();
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateString);
    return tomorrow.toDateString() === eventDate.toDateString();
  };

  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const weekFromNow = new Date();
    weekFromNow.setDate(today.getDate() + 7);
    return eventDate >= today && eventDate <= weekFromNow;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'work': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      case 'health': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'social': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
      case 'travel': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30';
      case 'personal': return 'text-pink-600 bg-pink-100 dark:text-pink-400 dark:bg-pink-900/30';
      case 'other': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getCategoryLabel = (category: string) => {
    return t(`categories.${category}`);
  };

  const getDateLabel = (dateString: string) => {
    if (isToday(dateString)) return t('dates.today');
    if (isTomorrow(dateString)) return t('dates.tomorrow');
    if (isThisWeek(dateString)) return t('dates.thisWeek');
    return '';
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'today') return isToday(event.date);
    if (filter === 'week') return isThisWeek(event.date);
    return event.category === filter;
  }).sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-light dark:border-primary-dark"></div>
        <span className="ml-4 text-text-secondary-light dark:text-text-secondary-dark">
          {t('events.loading')}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded">
          <strong className="font-bold">{t('common.error')}: </strong>
          <span>{t(error)}</span>
        </div>
        <button 
          onClick={fetchEvents}
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
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            {t('events.title')}
          </h1>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1"
            dangerouslySetInnerHTML={{ __html: t('events.dataSource') + t('events.dataSourcePath') }}
          ></p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
            className="px-4 py-2 bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark rounded-lg border border-border-light dark:border-border-dark hover:bg-card-light dark:hover:bg-card-dark transition-colors"
          >
            {view === 'list' ? t('common.calendar') : t('common.list')}
          </button>
          <button 
            onClick={handleAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90 transition-opacity">
            <Plus size={16} />
            {t('events.addNew')}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'today', 'week', 'work', 'health', 'social', 'travel', 'personal', 'other'].map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === filterType
                ? 'bg-primary-light dark:bg-primary-dark text-white'
                : 'bg-background-light dark:bg-background-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-card-light dark:hover:bg-card-dark'
            }`}
          >
            {filterType === 'all' || filterType === 'today' || filterType === 'week'
              ? t(`events.filters.${filterType}`)
              : t(`events.filters.${filterType}`, { defaultValue: getCategoryLabel(filterType) })}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('dates.today')}
          </h3>
          <p className="text-2xl font-bold text-primary-light dark:text-primary-dark">
            {events.filter(e => isToday(e.date)).length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('dates.tomorrow')}
          </h3>
          <p className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">
            {events.filter(e => isTomorrow(e.date)).length}
          </p>
        </div>
        <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
          <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
            {t('dates.thisWeek')}
          </h3>
          <p className="text-2xl font-bold text-accent-light dark:text-accent-dark">
            {events.filter(e => isThisWeek(e.date)).length}
          </p>
        </div>
      </div>

      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
          <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
            {t('events.upcomingEvents')} ({filteredEvents.length})
          </h2>
        </div>
        
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto text-text-secondary-light dark:text-text-secondary-dark mb-4" />
            <h3 className="text-lg font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('events.noEventsFound')}
            </h3>
            <p className="text-text-secondary-light dark:text-text-secondary-dark mb-4">
              {filter === 'all' ? t('events.addFirstEvent') : t('events.noEventsForFilter')}
            </p>
            <button 
              onClick={handleAddEvent}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-primary-light dark:bg-primary-dark text-white rounded-lg hover:opacity-90">
              <Plus size={16} />
              {t('events.addEvent')}
            </button>
          </div>
        ) : view === 'list' ? (
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">
              {t('events.calendarViewNotImplemented')}
            </p>
          </div>
        ) : (
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">
              {t('events.calendarViewNotImplemented')}
            </p>
          </div>
        )}
      </div>

      <AddEventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventAdded={fetchEvents}
      />
    </div>
  </>
  );
};

export default Events;