import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  Search,
  X,
  Bell,
  Settings,
  User,
  ChevronDown,
  LogOut,
  Globe,
  HelpCircle,
  Shield,
  Check
} from 'lucide-react';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // For single-user app, just clear any stored data and redirect to dashboard
    localStorage.removeItem('vitaapp-token');
    navigate('/dashboard');
  };

  const handleLanguageOpen = () => {
    setIsLanguageOpen(!isLanguageOpen);
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleProfileOpen = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsLanguageOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleNotificationsOpen = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsLanguageOpen(false);
    setIsProfileOpen(false);
  };

  const handleLanguageChange = (newLanguage: 'it' | 'en') => {
    setLanguage(newLanguage);
    setIsLanguageOpen(false);
  };

  return (
    <nav className="sticky top-0 z-30 w-full px-4 sm:px-6 lg:px-8 py-3 bg-card-light/80 dark:bg-card-dark/80 backdrop-blur-md border-b border-border-light/30 dark:border-border-dark/30 shadow-glass">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Logo with gradient effect */}
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">VitaApp</h1>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Language selector */}
          <div className="relative" ref={languageRef}>
            <button
              onClick={handleLanguageOpen}
              className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-colors"
              aria-label="Change language"
            >
              <Globe size={20} />
            </button>
            
            {isLanguageOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-card-light dark:bg-card-dark border border-border-light/30 dark:border-border-dark/30 rounded-xl shadow-glass-lg overflow-hidden z-50">
                <div className="py-2">
                  <button
                    onClick={() => handleLanguageChange('it')}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors ${
                      language === 'it' ? 'text-primary-light dark:text-primary-dark' : 'text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🇮🇹</span>
                      <span>Italiano</span>
                    </div>
                    {language === 'it' && <Check size={16} />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors ${
                      language === 'en' ? 'text-primary-light dark:text-primary-dark' : 'text-text-primary-light dark:text-text-primary-dark'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🇬🇧</span>
                      <span>English</span>
                    </div>
                    {language === 'en' && <Check size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-colors"
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          {/* Notifications dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationsOpen}
              className="p-2 rounded-full text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-colors relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-light dark:bg-accent-dark rounded-full"></span>
            </button>
            
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card-light dark:bg-card-dark border border-border-light/30 dark:border-border-dark/30 rounded-xl shadow-glass-lg overflow-hidden z-50">
                <div className="p-4 border-b border-border-light/30 dark:border-border-dark/30">
                  <h3 className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                    {t('settings.notificationsTitle')}
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-border-light/10 dark:border-border-dark/10 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                    
<p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                      {t('settings.notificationMessages.newFeature.title')}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {t('settings.notificationMessages.newFeature.description')}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                      {t('settings.notificationMessages.newFeature.time')}
                    </p>
                  </div>
                  <div className="p-4 hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors">
                    <p className="text-sm font-medium text-text-primary-light dark:text-text-primary-dark">
                      {t('settings.notificationMessages.subscription.title')}
                    </p>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {t('settings.notificationMessages.subscription.description')}
                    </p>
                    
<p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-2">
                      {t('settings.notificationMessages.subscription.time')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dark mode toggle with animation */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-background-light/50 dark:bg-background-dark/50 text-text-secondary-light dark:text-text-secondary-dark hover:bg-background-light dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-all duration-300"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400 animate-pulse-slow" />
            ) : (
              <Moon size={20} className="text-primary-light animate-pulse-slow" />
            )}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={handleProfileOpen}
              className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-background-light/50 dark:hover:bg-background-dark/50 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-neon dark:shadow-neon-accent">
                {t('settings.demoUser.name').charAt(0)}
              </div>
              <ChevronDown size={16} className={`text-text-secondary-light dark:text-text-secondary-dark transform transition-transform ${
                isProfileOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-card-light dark:bg-card-dark border border-border-light/30 dark:border-border-dark/30 rounded-xl shadow-glass-lg overflow-hidden z-50">
                {/* User Info Header */}
                <div className="p-4 border-b border-border-light/30 dark:border-border-dark/30 bg-gradient-to-r from-primary-light/5 to-accent-light/5 dark:from-primary-dark/5 dark:to-accent-dark/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark rounded-full flex items-center justify-center text-white font-semibold">
                      {t('settings.demoUser.name').charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary-light dark:text-text-primary-dark">
                        {t('settings.demoUser.name')}
                      </p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                        demo@vitaapp.com
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="py-2">
                  <Link 
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors group"
                  >
                    <User size={16} className="mr-3 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" />
                    {t('settings.editProfile')}
                  </Link>
                  
                  <Link 
                    to="/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors group"
                  >
                    <Settings size={16} className="mr-3 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" />
                    {t('nav.settings')}
                  </Link>
                  
                  <div className="border-t border-border-light/30 dark:border-border-dark/30 my-2"></div>
                  
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      // Toggle theme
                      toggleDarkMode();
                    }}
                    className="w-full flex items-center px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors group"
                  >
                    {darkMode ? (
                      <Sun size={16} className="mr-3 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                    ) : (
                      <Moon size={16} className="mr-3 text-primary-light dark:text-primary-dark group-hover:text-primary-light/80 dark:group-hover:text-primary-dark/80 transition-colors" />
                    )}
                    {darkMode ? t('settings.light') : t('settings.dark')}
                  </button>
                  
                  <Link 
                    to="/documents"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors group"
                  >
                    <Shield size={16} className="mr-3 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" />
                    {t('settings.privacy')}
                  </Link>
                  
                  <button 
                    className="w-full flex items-center px-4 py-3 text-sm text-text-primary-light dark:text-text-primary-dark hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors group"
                  >
                    <HelpCircle size={16} className="mr-3 text-text-secondary-light dark:text-text-secondary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors" />
                    {t('settings.support')}
                  </button>
                  
                  <div className="border-t border-border-light/30 dark:border-border-dark/30 my-2"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <LogOut size={16} className="mr-3 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                    {t('common.logout') || 'Esci'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global search modal with backdrop blur */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-16 sm:pt-24">
          <div className="w-full max-w-2xl bg-card-light dark:bg-card-dark rounded-xl shadow-glass-lg overflow-hidden border border-border-light/30 dark:border-border-dark/30 mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={20} className="text-text-secondary-light dark:text-text-secondary-dark" />
              </div>
              <input
                type="text"
                placeholder={t('common.search')}
                className="w-full pl-12 pr-12 py-4 bg-transparent border-none focus:ring-0 text-text-primary-light dark:text-text-primary-dark text-lg"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                <X size={20} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-text-primary-light dark:hover:text-text-primary-dark transition-colors" />
              </button>
            </div>
            <div className="p-4 border-t border-border-light/30 dark:border-border-dark/30">
              <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                {t('common.recentSearches')}
              </p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center p-2 rounded-lg hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer">
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {t('common.dashboardOverview')}
                  </p>
                </div>
                <div className="flex items-center p-2 rounded-lg hover:bg-background-light/50 dark:hover:bg-background-dark/50 transition-colors cursor-pointer">
                  <p className="text-text-primary-light dark:text-text-primary-dark">
                    {t('common.upcomingDeadlines')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
