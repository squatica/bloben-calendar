import { AppSettings } from '../../types/interface';
import { CalendarView } from 'kalend';

export const initSettings = (): AppSettings => {
  return {
    logging: false,
    timeFormat: '24',
    startOfWeek: 'Monday',
    defaultView: CalendarView.WEEK,
    hourHeight: 40,
    disabledViews: [],
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hiddenCalendarIDs: [],
  };
};

const settings = (state: AppSettings = initSettings(), action: any) => {
  switch (action.type) {
    case 'SET_SETTINGS':
      return action.payload;
    case 'UPDATE_SETTINGS':
      return { ...state, ...{ [action.payload.key]: action.payload.value } };
    default:
      return state;
  }
};

export default settings;
