import { CalDavEvent } from '../../types/interface';

const calDavEvents = (state: CalDavEvent[] = [], action: any) => {
  switch (action.type) {
    case 'SET_CALDAV_EVENTS':
      return action.payload;
    case 'INSERT_CALDAV_EVENTS':
      return [...state, ...action.payload];
    case 'UPDATE_CALDAV_EVENT':
      return state.map((item) =>
        item.url === action.payload.url ? action.payload : item
      );
    case 'DELETE_CALDAV_EVENT':
      return state.filter((item) => item.url !== action.payload.url);
    default:
      return state;
  }
};

export default calDavEvents;
