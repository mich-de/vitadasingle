// Date utilities following AI Coding Guidelines
// All dates stored as ISO 8601 strings (YYYY-MM-DD or RFC 3339)

/**
 * Generate current timestamp in ISO 8601 format with timezone
 * @returns {string} Current timestamp in RFC 3339 format
 */
export const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Generate current date in ISO 8601 format (date only)
 * @returns {string} Current date in YYYY-MM-DD format
 */
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Convert ISO 8601 date to Date object
 * @param {string} dateString - ISO 8601 date string
 * @returns {Date} Date object
 */
export const parseISODate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Format ISO 8601 date for display based on locale
 * @param {string} dateString - ISO 8601 date string
 * @param {string} locale - Language locale (en-US, it-IT)
 * @returns {string} Formatted date string
 */
export const formatDateForDisplay = (dateString: string, locale: string = 'en-US'): string => {
  const date = parseISODate(dateString);
  
  // Map language codes to Intl locales
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const intlLocale = localeMap[locale] || 'en-US';
  
  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

/**
 * Format ISO 8601 datetime for display based on locale
 * @param {string} dateString - ISO 8601 datetime string
 * @param {string} locale - Language locale (en-US, it-IT)
 * @returns {string} Formatted datetime string
 */
export const formatDateTimeForDisplay = (dateString: string, locale: string = 'en-US'): string => {
  const date = parseISODate(dateString);
  
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const intlLocale = localeMap[locale] || 'en-US';
  
  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Calculate days remaining from today to target date
 * @param {string} targetDateString - ISO 8601 date string
 * @returns {number} Days remaining (negative if past)
 */
export const calculateDaysRemaining = (targetDateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const targetDate = parseISODate(targetDateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Check if date is today
 * @param {string} dateString - ISO 8601 date string
 * @returns {boolean} True if date is today
 */
export const isToday = (dateString: string): boolean => {
  const today = getCurrentDate();
  return dateString.split('T')[0] === today;
};

/**
 * Check if date is within a certain number of days from today
 * @param {string} dateString - ISO 8601 date string
 * @param {number} days - Number of days to check
 * @returns {boolean} True if date is within range
 */
export const isWithinDays = (dateString: string, days: number): boolean => {
  const remainingDays = calculateDaysRemaining(dateString);
  return remainingDays >= 0 && remainingDays <= days;
};

/**
 * Convert user input date to ISO 8601 format
 * @param {string} userDate - User input date (various formats)
 * @returns {string} ISO 8601 date string
 */
export const convertToISODate = (userDate: string): string => {
  const date = new Date(userDate);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }
  return date.toISOString().split('T')[0];
};

/**
 * Add days to ISO 8601 date
 * @param {string} dateString - ISO 8601 date string
 * @param {number} days - Number of days to add
 * @returns {string} New ISO 8601 date string
 */
export const addDaysToDate = (dateString: string, days: number): string => {
  const date = parseISODate(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

/**
 * Get relative time description
 * @param {string} dateString - ISO 8601 date string
 * @param {string} locale - Language locale
 * @returns {string} Relative time description
 */
export const getRelativeTimeDescription = (dateString: string, locale: string = 'en-US'): string => {
  const days = calculateDaysRemaining(dateString);
  
  const translations = {
    'en': {
      today: 'Today',
      tomorrow: 'Tomorrow',
      yesterday: 'Yesterday',
      inDays: 'In {days} days',
      daysAgo: '{days} days ago'
    },
    'it': {
      today: 'Oggi',
      tomorrow: 'Domani',
      yesterday: 'Ieri',
      inDays: 'Tra {days} giorni',
      daysAgo: '{days} giorni fa'
    }
  };
  
  const t = translations[locale as keyof typeof translations] || translations['en'];
  
  if (days === 0) return t.today;
  if (days === 1) return t.tomorrow;
  if (days === -1) return t.yesterday;
  if (days > 0) return t.inDays.replace('{days}', days.toString());
  return t.daysAgo.replace('{days}', Math.abs(days).toString());
};
