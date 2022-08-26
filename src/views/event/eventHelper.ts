import { DateTime } from 'luxon';
import { OnNewEventClickData } from 'kalend';

/**
 * Get time from clicked on timetable
 *
 * @param newEventTime
 */
export const calculateNewEventTime = (
  newEventTime: OnNewEventClickData
): DateTime => {
  // Get date of new event
  const selectedDate: any = DateTime.fromJSDate(newEventTime.day);

  return selectedDate.set({ hour: newEventTime.hour, minute: 0, second: 0 });
};

/**
 * Set default reminder
 *
 * @param defaultReminderProps
 * @param setForm
 */
export const setDefaultReminder = (defaultReminderProps: any, setForm: any) => {
  if (defaultReminderProps === 'none' || defaultReminderProps === undefined) {
    setForm('reminder', false);
    setForm('reminderValue', { label: '5 minutes before', value: '5' });
  } else {
    setForm('reminder', true);
    if (defaultReminderProps === '0') {
      setForm('reminderValue', { label: 'On start', value: '0' });
    } else if (defaultReminderProps === '5') {
      setForm('reminderValue', { label: '5 minutes before', value: '5' });
    } else if (defaultReminderProps === '15') {
      setForm('reminderValue', { label: '15 minutes before', value: '15' });
    } else if (defaultReminderProps === '60') {
      setForm('reminderValue', { label: 'Hour before', value: '60' });
    } else if (defaultReminderProps === '360') {
      setForm('reminderValue', { label: '6 hours before', value: '360' });
    } else if (defaultReminderProps === '1440') {
      setForm('reminderValue', { label: 'Day before', value: '1440' });
    } else if (defaultReminderProps === '10080') {
      setForm('reminderValue', { label: 'Week before', value: '10080' });
    }
  }
};
