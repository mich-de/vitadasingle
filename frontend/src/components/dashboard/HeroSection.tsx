import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  lastUpdated?: string;
}

// Add named export alongside default export
export const HeroSection: React.FC<HeroSectionProps> = ({ lastUpdated }) => {
  const { darkMode } = useTheme();
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-20 lg:py-28 bg-gradient-to-br from-background-light via-background-light/90 to-background-light dark:from-background-dark dark:via-background-dark/90 dark:to-background-dark rounded-xl shadow-glass-soft mb-8 md:mb-12 border border-border-light/20 dark:border-border-dark/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">
            {t('dashboard.welcome')}
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-text-secondary-light dark:text-text-secondary-dark mb-8 md:mb-10">
          {t('dashboard.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            className={`px-8 py-3.5 text-base font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4
              ${darkMode 
                ? 'bg-primary-dark hover:bg-primary-dark/90 text-white focus:ring-primary-dark/50'
                : 'bg-primary-light hover:bg-primary-light/90 text-white focus:ring-primary-light/50'
              }
            `}
          >
            {t('dashboard.getStarted')}
          </button>
          <button
            className={`px-8 py-3.5 text-base font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 flex items-center
            ${darkMode
              ? 'bg-card-dark hover:bg-card-dark/80 text-text-primary-dark focus:ring-border-dark/50 border border-border-dark/50'
              : 'bg-card-light hover:bg-card-light/80 text-text-primary-light focus:ring-border-light/50 border border-border-light/50'
            }
            `}
          >
            {t('dashboard.learnMore')} <ChevronRight size={20} className="ml-2" />
          </button>
        </div>
        {lastUpdated && (
          <p className="mt-6 text-xs text-text-secondary-light dark:text-text-secondary-dark">
            {t('dashboard.lastUpdated')}: {lastUpdated}
          </p>
        )}
      </div>
    </section>
  );
};

// Keep default export for backward compatibility
export default HeroSection;