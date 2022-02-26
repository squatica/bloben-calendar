import { OnPageChangeData } from 'kalend';

const calendarDaysRange = (
  state: OnPageChangeData = { rangeFrom: '', rangeTo: '', direction: 'today' },
  action: any
) => {
  switch (action.type) {
    case 'SET_CALENDAR_DAYS_RANGE':
      return action.payload;
    default:
      return state;
  }
};

export default calendarDaysRange;
