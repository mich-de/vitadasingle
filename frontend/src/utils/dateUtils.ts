// src/utils/dateUtils.ts

/**
 * Formats a date string or Date object into a localized date string.
 * Uses the user's browser locale by default.
 * @param date - The date to format.
 * @param locales - Optional. A string with a BCP 47 language tag, or an array of such strings.
 * @param options - Optional. An object with some or all of the following properties: dateStyle, timeStyle, etc.
 * @returns A string with a language-sensitive representation of the given date.
 */
export const formatDate = (
  date: string | Date,
  locales?: string | string[],
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Default options if none are provided
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return dateObj.toLocaleDateString(locales, options || defaultOptions);
};

/**
 * Formats a date string or Date object into a localized date and time string.
 * @param date - The date to format.
 * @param locales - Optional. A string with a BCP 47 language tag, or an array of such strings.
 * @returns A string with a language-sensitive representation of the given date and time.
 */
export const formatDateTime = (
  date: string | Date,
  locales?: string | string[]
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(locales);
};