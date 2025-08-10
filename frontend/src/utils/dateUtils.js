import { format, parseISO } from 'date-fns';

/**
 * Parse a datetime string from the backend and return a proper Date object
 * This ensures the datetime is treated as local time (not converted from UTC)
 */
export const parseDateTime = (dateTimeString) => {
  if (!dateTimeString) return null;
  
  // Remove the 'Z' suffix and microseconds to treat the time as local time
  // This prevents automatic timezone conversion
  let cleanDateString = dateTimeString.replace('Z', '').replace(/\.\d{6}/, '');
  
  // Parse as if it's local time
  return parseISO(cleanDateString);
};

/**
 * Format a datetime for display in the UI
 * Shows both date and time
 */
export const formatDateTime = (dateTimeString, formatString = 'MMM dd, yyyy HH:mm') => {
  const date = parseDateTime(dateTimeString);
  if (!date) return '';
  
  return format(date, formatString);
};

/**
 * Format just the date part
 */
export const formatDate = (dateTimeString, formatString = 'EEEE, MMMM dd, yyyy') => {
  const date = parseDateTime(dateTimeString);
  if (!date) return '';
  
  return format(date, formatString);
};

/**
 * Format just the time part
 */
export const formatTime = (dateTimeString, formatString = 'HH:mm') => {
  const date = parseDateTime(dateTimeString);
  if (!date) return '';
  
  return format(date, formatString);
};

/**
 * Format datetime for form inputs (datetime-local)
 */
export const formatForInput = (dateTimeString) => {
  const date = parseDateTime(dateTimeString);
  if (!date) return '';
  
  return format(date, "yyyy-MM-dd'T'HH:mm");
};

/**
 * Convert form input datetime to backend format
 */
export const formatForBackend = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  const date = new Date(dateTimeString);
  return date.toISOString().slice(0, 19) + '.000000Z';
};
