import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconColor?: string; 
  description?: string;
  trend?: string; 
  trendColor?: string; 
  cta?: {
    text: string;
    link: string;
  };
}

// Add named export alongside default export
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: IconComponent,
  iconColor = 'text-primary-light dark:text-primary-dark',
  description,
  trend,
  trendColor = 'text-text-secondary-light dark:text-text-secondary-dark',
  cta
}) => {
  return (
    <div className="relative overflow-hidden bg-card-light dark:bg-card-dark backdrop-blur-sm p-5 sm:p-6 rounded-xl border border-border-light/30 dark:border-border-dark/30 shadow-glass hover:shadow-glass-lg transition-all duration-300 group flex flex-col">
      {/* Subtle background gradient on hover */}
      <div className="absolute -inset-px bg-gradient-to-br from-primary-light/10 via-transparent to-accent-light/10 dark:from-primary-dark/10 dark:via-transparent dark:to-accent-dark/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10 flex-grow">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-text-primary-light dark:text-text-primary-dark group-hover:text-primary-light dark:group-hover:text-primary-dark transition-colors duration-300">
            {title}
          </h3>
          <div className="p-2.5 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ background: 'none' }}>
            <IconComponent size={20} className={iconColor} />
          </div> 
        </div>
        <p className="text-3xl sm:text-4xl font-bold text-text-primary-light dark:text-text-primary-dark mb-2 sm:mb-3">
          {value}
        </p>
        {description && (
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3 sm:mb-4 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {(trend || cta) && (
        <div className="relative z-10 mt-auto pt-3 sm:pt-4 border-t border-border-light/20 dark:border-border-dark/20 flex items-center justify-between">
          {trend && (
            <p className={`text-xs sm:text-sm ${trendColor} font-medium flex items-center`}>
              {trend}
            </p>
          )}
          {cta && (
            <a 
              href={cta.link}
              className={`text-xs sm:text-sm font-medium ${iconColor} hover:underline group-hover:translate-x-1 transition-transform duration-300`}
            >
              {cta.text} &rarr;
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Keep default export for backward compatibility
export default DashboardCard;