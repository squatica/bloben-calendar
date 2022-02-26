import { CalDavCalendar } from '../../types/interface';

const calDavCalendars = (state: CalDavCalendar[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CALDAV_CALENDARS':
      return action.payload;
    case 'ADD_TO_CALDAV_CALENDARS':
      return [...state, ...action.payload];
    case 'UPDATE_CALDAV_CALENDAR':
      return state.map((item) =>
        item.url === action.payload.url ? action.payload : item
      );
    case 'DELETE_CALDAV_CALENDAR':
      return state.filter((item) => item.id !== action.payload.id);
    default:
      return state;
  }
};

export default calDavCalendars;
