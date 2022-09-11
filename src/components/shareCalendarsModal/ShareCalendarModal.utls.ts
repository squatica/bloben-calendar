import { CALENDAR_VIEW } from 'kalend/common/enums';

export default {
  state: {
    name: '',
    calDavCalendars: [],
    webcalCalendars: [],
    expireAt: null,
    password: null,
    settings: {
      timeFormat: 24,
      startOfWeek: 'Monday',
      defaultView: CALENDAR_VIEW.WEEK,
      hourHeight: 40,
      showWeekNumbers: false,
    },
  },
};
