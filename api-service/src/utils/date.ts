import { utcToZonedTime } from 'date-fns-tz';

/**
 * Convert UTC date to Australia/Sydney timezone
 * @param date Date
 * @returns Date
 */
export const convertUtcToAusTimeZone = (date: Date): Date => {
  const timeZone = 'Australia/Sydney';
  return utcToZonedTime(date, timeZone);
};
