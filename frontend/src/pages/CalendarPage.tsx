import React, { useEffect, useState, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { apiService } from "../services/apiService";
import type { Deadline, Event, Booking } from "../types";
import { ChevronLeft, ChevronRight, Search, Plus } from "lucide-react";
import "../styles/ModernCalendar.css";

interface CalendarItem {
  id: string;
  type: "deadline" | "event" | "booking";
  title: string;
  date: string;
  description?: string;
  time?: string;
  location?: string;
  checkOut?: string; // For booking items
  color: string;
}

type FilterType = "all" | "shared" | "public" | "archived";

const CalendarPage: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const safeCreateDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const [deadlinesResult, eventsResult, bookingsResult] = await Promise.allSettled([
      apiService.getDeadlines(),
      apiService.getEvents(),
      apiService.getBookings(),
    ]);

    const loadedItems: CalendarItem[] = [];
    const errors: string[] = [];

    const typeColorMap = {
      deadline: "#f9a825", // Yellow
      event: "#42a5f5",    // Blue
      booking: "#66bb6a",   // Green
    };

    if (deadlinesResult.status === 'fulfilled') {
      deadlinesResult.value.forEach((d: Deadline) => {
        const date = safeCreateDate(d.date);
        if (date) {
          loadedItems.push({
            id: d.id,
            type: "deadline",
            title: d.title,
            description: d.description,
            date: date.toISOString().slice(0, 10),
            color: typeColorMap.deadline,
          });
        }
      });
    } else {
      errors.push("scadenze");
    }

    if (eventsResult.status === 'fulfilled') {
      eventsResult.value.forEach((e: Event) => {
        const date = safeCreateDate(e.date);
        if (date) {
          loadedItems.push({
            id: e.id,
            type: "event",
            title: e.title,
            description: e.description,
            time: e.time,
            location: e.location,
            date: date.toISOString().slice(0, 10),
            color: typeColorMap.event,
          });
        }
      });
    } else {
      errors.push("eventi");
    }

    if (bookingsResult.status === 'fulfilled') {
      bookingsResult.value.forEach((b: Booking) => {
        const startDate = safeCreateDate(b.checkIn);
        const endDate = safeCreateDate(b.checkOut);
        if (startDate && endDate) {
          let currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            loadedItems.push({
              id: `${b.id}-${currentDate.toISOString().slice(0, 10)}`,
              type: "booking",
              title: b.guestName,
              description: `${b.adults} adulti, ${b.children} bambini`,
              date: currentDate.toISOString().slice(0, 10),
              checkOut: endDate.toISOString().slice(0, 10),
              color: typeColorMap.booking,
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        }
      });
    } else {
      errors.push("prenotazioni");
    }

    setItems(loadedItems);
    if (errors.length > 0) {
      setError(`Impossibile caricare: ${errors.join(', ')}`);
    }
    setLoading(false);
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // Monday is 0

    const days = [];

    // Previous month's days
    for (let i = 0; i < startDayOfWeek; i++) {
      const day = new Date(year, month, 0 - i);
      days.unshift({ date: day, isOtherMonth: true });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push({ date: day, isOtherMonth: false });
    }

    // Next month's days
    const remainingCells = 42 - days.length; // 6 weeks grid
    for (let i = 1; i <= remainingCells; i++) {
      const day = new Date(year, month + 1, i);
      days.push({ date: day, isOtherMonth: true });
    }

    return days;
  }, [currentDate]);

  const itemsByDate = useMemo(() => {
    return items.reduce<Record<string, CalendarItem[]>>((acc, item) => {
      const dateKey = item.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(item);
      return acc;
    }, {});
  }, [items]);

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  if (loading) return <div>{t('calendar.loading')}</div>;
  if (error) return <div>{t('calendar.error')}: {error}</div>;

  return (
    <>
      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mt-1 mb-4"
        dangerouslySetInnerHTML={{ __html: t('calendar.dataSource') }}
      ></p>
      <div className="modern-calendar-container p-4 bg-gray-50">
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{t('calendar.title')}</h1>
            <div className="ml-6 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg p-1">
              {[t('calendar.allEvents'), t('calendar.shared'), t('calendar.public'), t('calendar.archived')].map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f.toLowerCase() as FilterType)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === f.toLowerCase() ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder={t('calendar.searchPlaceholder')} className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div className="flex items-center bg-white border border-gray-200 rounded-lg">
              <button onClick={handlePrevMonth} className="p-2 text-gray-500 hover:bg-gray-50 rounded-l-lg"><ChevronLeft size={20} /></button>
              <button onClick={handleToday} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-l border-r">{t('calendar.today')}</button>
              <button onClick={handleNextMonth} className="p-2 text-gray-500 hover:bg-gray-50 rounded-r-lg"><ChevronRight size={20} /></button>
            </div>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option>{t('calendar.monthView')}</option>
              <option>{t('calendar.weekView')}</option>
              <option>{t('calendar.dayView')}</option>
            </select>
            <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800">
              <Plus size={16} />
              <span>{t('calendar.addEvent')}</span>
            </button>
          </div>
        </header>

        <div className="flex items-center mb-4">
          <div className="flex items-baseline">
            <span className="text-5xl font-bold text-gray-800">{currentDate.toLocaleDateString('en-US', { day: 'numeric' })}</span>
            <span className="ml-2 text-lg font-medium text-gray-500">{currentDate.toLocaleDateString(t('calendar.locale'), { weekday: 'long' })}</span>
          </div>
          <div className="ml-4 text-lg text-gray-600">
            {currentDate.toLocaleDateString(t('calendar.locale'), { month: 'long', year: 'numeric' })}
          </div>

          <div className="calendar-grid flex-grow">
            {['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="calendar-day-header text-sm font-medium text-gray-500 py-2 border-b-2 border-gray-200">{t(`calendar.days.${day.toLowerCase()}`)}</div>
            ))}
            {calendarDays.map(({ date, isOtherMonth }, index) => {
              const dateKey = date.toISOString().slice(0, 10);
              const dayItems = itemsByDate[dateKey] || [];
              const isToday = dateKey === new Date().toISOString().slice(0, 10);

              return (
                <div key={index} className={`calendar-cell border-t border-l border-gray-200 p-2 h-32 flex flex-col ${isOtherMonth ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className={`day-number text-sm font-medium ${isOtherMonth ? 'text-gray-400' : 'text-gray-700'} ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                    {date.getDate()}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto">
                    {dayItems.slice(0, 3).map(item => (
                      <div key={item.id} className="event-item text-xs p-1 rounded-md text-white" style={{ backgroundColor: item.color }}>
                        {item.title}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-xs text-gray-500 mt-1">{t('calendar.moreEvents', { count: dayItems.length - 3 })}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage;