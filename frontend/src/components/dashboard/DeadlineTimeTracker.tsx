import React, { useEffect, useState } from 'react';
import { differenceInDays, format } from 'date-fns';

interface Deadline {
  id: string;
  title: string;
  dueDate: string;
  category: string;
  completed: boolean;
}

const DeadlineTimeTracker = () => {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch('/api/data/scadenze.json');
        const data = await response.json();
        setDeadlines(data.filter((d: Deadline) => !d.completed).sort((a: Deadline, b: Deadline) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
      } catch (error) {
        console.error('Error fetching deadlines:', error);
      }
    };

    fetchDeadlines();
  }, []);

  const getDaysRemaining = (dueDate: string) => {
    return differenceInDays(new Date(dueDate), new Date());
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Deadline Time Tracker</h2>
      <div className="space-y-4">
        {deadlines.slice(0, 5).map(deadline => {
          const daysRemaining = getDaysRemaining(deadline.dueDate);
          const isOverdue = daysRemaining < 0;
          const isToday = daysRemaining === 0;

          return (
            <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">{deadline.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Scade il: {format(new Date(deadline.dueDate), 'dd/MM/yyyy')}</p>
              </div>
              <div className={`text-sm font-bold px-3 py-1 rounded-full ${isOverdue ? 'bg-red-100 text-red-800' : isToday ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {isOverdue ? `Scaduta da ${Math.abs(daysRemaining)} giorni` : isToday ? 'Oggi' : `${daysRemaining} giorni`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeadlineTimeTracker;