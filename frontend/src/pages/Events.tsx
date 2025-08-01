import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useEvents } from '../hooks/useEvents';
import { Calendar, Clock, MapPin, Users, Plus, Edit, Trash2 } from 'lucide-react';
import type { Event } from '../types';
import { AddEventModal } from '../components/modals/AddEventModal';
import { ConfirmDeleteModal } from '../components/modals/ConfirmDeleteModal';

const Events = () => {
  const { t } = useLanguage();
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent } = useEvents();
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = (id: string) => {
    setSelectedEvent(events.find(e => e.id === id) || null);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setIsConfirmModalOpen(false);
      setSelectedEvent(null);
    }
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

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(t('dates.locale'), {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return (
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
    );
  };

  const isTomorrow = (dateString: string) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const eventDate = new Date(dateString);
    return (
      eventDate.getDate() === tomorrow.getDate() &&
      eventDate.getMonth() === tomorrow.getMonth() &&
      eventDate.getFullYear() === tomorrow.getFullYear()
    );
  };

  const isThisWeek = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Sunday
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); // Saturday

    return eventDate >= firstDayOfWeek && eventDate <= lastDayOfWeek;
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

  const filteredEvents = (events || []).filter(event => {
    if (filter === 'all') return true;
    if (filter === 'today') return isToday(event.startDate);
    if (filter === 'week') return isThisWeek(event.startDate);
    return event.category === filter;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

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
          onClick={() => fetchEvents()}
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
              {(events || []).filter(e => isToday(e.startDate)).length}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('dates.tomorrow')}
            </h3>
            <p className="text-2xl font-bold text-secondary-light dark:text-secondary-dark">
              {(events || []).filter(e => isTomorrow(e.startDate)).length}
            </p>
          </div>
          <div className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-soft">
            <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark mb-2">
              {t('dates.thisWeek')}
            </h3>
            <p className="text-2xl font-bold text-accent-light dark:text-accent-dark">
              {(events || []).filter(e => isThisWeek(e.startDate)).length}
            </p>
          </div>
        </div>

        <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-border-light/30 dark:border-border-dark/30">
            <h2 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">
              {t('events.upcomingEvents')} ({filteredEvents.length})
            </h2>
          </div>
          <div className="p-6">
            {filteredEvents.length > 0 ? (
              <div className="space-y-4">
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-background-light dark:bg-background-dark p-4 rounded-lg shadow-sm border border-border-light dark:border-border-dark">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary-light dark:text-text-primary-dark">{event.title}</h3>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1"><Calendar size={14} /> {formatDate(event.startDate)}</p>
                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1"><Clock size={14} /> {formatTime(event.startDate)}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                        {getCategoryLabel(event.category)}
                      </div>
                    </div>
                    {event.location && (
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1 mb-2"><MapPin size={14} /> {event.location}</p>
                    )}
                    {event.description && (
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-2">{event.description}</p>
                    )}
                    {event.attendees && event.attendees.length > 0 && (
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1 mb-2"><Users size={14} /> {event.attendees.join(', ')}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleEditEvent(event)} className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-gray-200 dark:bg-gray-700 text-text-primary-light dark:text-text-primary-dark hover:bg-gray-300 dark:hover:bg-gray-600"><Edit size={14} /> {t('common.edit')}</button>
                      <button onClick={() => handleDeleteEvent(event.id)} className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800"><Trash2 size={14} /> {t('common.delete')}</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-center py-8">
                {t('events.noEventsFound')}
              </p>
            )}
          </div>
        </div>
      </div>
      <AddEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventAdded={(newEvent) => {
          createEvent(newEvent);
          setIsModalOpen(false);
        }}
        onEventUpdated={(updatedEvent) => {
          updateEvent(updatedEvent.id, updatedEvent);
          setIsModalOpen(false);
        }}
        event={selectedEvent}
      />

      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title={t('events.deleteTitle')}
        message={t('events.deleteMessage', { eventName: selectedEvent?.title })}
      />
    </>
  );
};

export default Events;
