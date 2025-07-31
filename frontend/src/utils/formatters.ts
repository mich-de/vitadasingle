// Formatters following AI Coding Guidelines
// All code in English with internationalization support

import { formatDateForDisplay, formatDateTimeForDisplay, calculateDaysRemaining } from './dateHelpers';

/**
 * Format currency based on locale
 * @param {number} amount - Amount to format
 * @param {string} locale - Language locale (en, it)
 * @param {string} currency - Currency code (EUR, USD)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount: number, locale: string = 'en', currency: string = 'EUR'): string => {
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const intlLocale = localeMap[locale] || 'en-US';
  
  return new Intl.NumberFormat(intlLocale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

/**
 * Format date for display (uses ISO 8601 dates)
 * @param {string} dateString - ISO 8601 date string
 * @param {string} locale - Language locale (en, it)
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString: string, locale: string = 'en'): string => {
  return formatDateForDisplay(dateString, locale);
};

/**
 * Format datetime for display (uses ISO 8601 dates)
 * @param {string} dateString - ISO 8601 datetime string
 * @param {string} locale - Language locale (en, it)
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateString: string, locale: string = 'en'): string => {
  return formatDateTimeForDisplay(dateString, locale);
};

/**
 * Get localized category label
 * @param {string} category - Category key
 * @param {Function} t - Translation function (optional)
 * @returns {string} Localized category label
 */
export const getCategoryLabel = (category: string, t?: (key: string) => string): string => {
  // If no translation function is provided, format the category directly
  if (!t) {
    // Convert category to title case (e.g., 'food' -> 'Food')
    return category.charAt(0).toUpperCase() + category.slice(1);
  }
  
  const categoryKey = `expenses.category.${category}`;
  return t(categoryKey);
};

/**
 * Get days remaining until target date
 * @param {string} dateString - ISO 8601 date string
 * @returns {number} Days remaining (negative if past)
 */
export const getDaysRemaining = (dateString: string): number => {
  return calculateDaysRemaining(dateString);
};

/**
 * Get localized vehicle type label
 * @param {string} type - Vehicle type key
 * @param {Function} t - Translation function
 * @returns {string} Localized type label
 */
export const getVehicleTypeLabel = (type: string, t: (key: string) => string): string => {
  const typeKey = `vehicles.type.${type}`;
  return t(typeKey);
};

/**
 * Get localized fuel type label
 * @param {string} fuelType - Fuel type key
 * @param {Function} t - Translation function
 * @returns {string} Localized fuel type label
 */
export const getFuelTypeLabel = (fuelType: string, t: (key: string) => string): string => {
  const fuelTypeKey = `vehicles.fuelType.${fuelType}`;
  return t(fuelTypeKey);
};

/**
 * Get localized payment method label
 * @param {string} paymentMethod - Payment method key
 * @param {Function} t - Translation function
 * @returns {string} Localized payment method label
 */
export const getPaymentMethodLabel = (paymentMethod: string, t: (key: string) => string): string => {
  const paymentMethodKey = `expenses.paymentMethod.${paymentMethod}`;
  return t(paymentMethodKey);
};

/**
 * Format number with thousands separator
 * @param {number} value - Number to format
 * @param {string} locale - Language locale (en, it)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value: number, locale: string = 'en'): string => {
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const intlLocale = localeMap[locale] || 'en-US';
  
  return new Intl.NumberFormat(intlLocale).format(value);
};

/**
 * Format percentage value
 * @param {number} value - Percentage value (0-100)
 * @param {string} locale - Language locale (en, it)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value: number, locale: string = 'en'): string => {
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'it': 'it-IT'
  };
  
  const intlLocale = localeMap[locale] || 'en-US';
  
  return new Intl.NumberFormat(intlLocale, {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(value / 100);
};

/**
 * Format file size in human readable format
 * @param {number} bytes - File size in bytes
 * @param {string} locale - Language locale (en, it)
 * @returns {string} Formatted file size string
 */
export const formatFileSize = (bytes: number, locale: string = 'en'): string => {
  const sizes = {
    'en': ['Bytes', 'KB', 'MB', 'GB', 'TB'],
    'it': ['Byte', 'KB', 'MB', 'GB', 'TB']
  };
  
  const sizeLabels = sizes[locale as keyof typeof sizes] || sizes['en'];
  
  if (bytes === 0) return `0 ${sizeLabels[0]}`;
  
  const k = 1024;
  const dm = 2;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizeLabels[i]}`;
};

// Legacy compatibility functions (deprecated - use localized versions)
export const getTypeLabel = (type: string): string => {
  return type === 'car' ? 'Car' : type === 'motorcycle' ? 'Motorcycle' : type;
};
