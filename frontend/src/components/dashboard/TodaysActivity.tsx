import { useEffect, useState } from 'react';
import { format, isToday } from 'date-fns';
import { useLanguage } from '../../context/LanguageContext';
import { apiService } from '../../services/apiService';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
}

const TodaysActivity = () => {
  const { t } = useLanguage();
  const [todaysEvents, setTodaysEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.getEvents();
        setTodaysEvents(data.filter((e: Event) => isToday(new Date(e.date))));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Today's Activity</h2>
      <div className="space-y-3">
        {todaysEvents.length > 0 ? (
          todaysEvents.map(event => (
            <div key={event.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark p-2 rounded-full">
                <span className="font-bold text-sm">{format(new Date(`${event.date}T${event.time}`), 'HH:mm')}</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{event.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{event.category}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('dashboard.noActivityToday')}</p>
        )}
      </div>
    </div>
  );
};

export default TodaysActivity;