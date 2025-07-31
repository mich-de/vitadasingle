import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { Home, Settings, Calendar, User, FileText, Briefcase, Car, DollarSign, Clock, Book, Zap, Users } from 'lucide-react';

const mainMenuItems = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Bookings', icon: Book, path: '/bookings' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Contacts', icon: Users, path: '/contacts' },
  { name: 'Deadlines', icon: Clock, path: '/deadlines' },
  { name: 'Documents', icon: FileText, path: '/documents' },
  { name: 'Events', icon: Zap, path: '/events' },
  { name: 'Expenses', icon: DollarSign, path: '/expenses' },
  { name: 'Properties', icon: Briefcase, path: '/properties' },
  { name: 'Vehicles', icon: Car, path: '/vehicles' },
  { name: 'Workouts', icon: Zap, path: '/workouts' },
  { name: 'Profile', icon: User, path: '/profile' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="w-64 min-h-screen bg-white dark:bg-gray-800 flex flex-col p-6">
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">VitaApp</h1>
      </div>

      <nav className="flex-1">
        <ul>
          {mainMenuItems.map((item) => (
            <li key={item.name} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <div className="flex items-center">
                  <item.icon size={20} className="mr-3" />
                  <span>{t(`nav.${item.name.toLowerCase()}`)}</span>
                </div>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;