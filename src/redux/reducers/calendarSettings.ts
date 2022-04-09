import { CALENDAR_VIEW } from 'kalend-layout';
import { CalendarSettingsResponse } from '../../bloben-interface/calendarSettings/calendarSettings';
import { getLocalTimezone } from '../../utils/common';

export const defaultCalendarSettings = {
  timeFormat: 24,
  hourHeight: 40,
  startOfWeek: 'Monday',
  defaultCalendarID: '',
  timezone: getLocalTimezone(),
  defaultView: CALENDAR_VIEW.WEEK,
};

const calendarSettings = (
  state: CalendarSettingsResponse = defaultCalendarSettings,
  action: any
) => {
  switch (action.type) {
    case 'SET_CALENDAR_SETTINGS': {
      const data: CalendarSettingsResponse = action.payload;

      if (!data.timezone) {
        data.timezone = getLocalTimezone();
      }

      return data;
    }
    default:
      return state;
  }
};

export default calendarSettings;
