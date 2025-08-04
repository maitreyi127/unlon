// Utility for managing requested activities state across pages using localStorage

const STORAGE_KEY = 'unalon_requested_activities';

export const getRequestedActivities = (): Set<string> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const array = JSON.parse(stored);
      return new Set(array);
    }
  } catch (error) {
    console.error('Error reading requested activities from localStorage:', error);
  }
  return new Set();
};

export const addRequestedActivity = (activityId: string): void => {
  try {
    const current = getRequestedActivities();
    current.add(activityId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(current)));
  } catch (error) {
    console.error('Error saving requested activity to localStorage:', error);
  }
};

export const isActivityRequested = (activityId: string): boolean => {
  const requested = getRequestedActivities();
  return requested.has(activityId);
};

export const clearRequestedActivities = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing requested activities from localStorage:', error);
  }
};