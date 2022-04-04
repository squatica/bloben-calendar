import { DateTime } from 'luxon';

export const initialFormState: any = {
  prevItem: {},
  id: '',
  summary: '',
  location: '',
  description: '',
  calendarUrl: null,
  timezone: null,
  allDay: false,
  startAt: DateTime.local().toString(),
  timezoneStartAt: null,
  endAt: DateTime.local().plus({ hours: 1 }).toString(),
  timezoneEndAt: null,
  color: null,
  isRepeated: false,
  alarms: [],
  attendees: [],
  createdAt: null,
  updatedAt: null,
  organizer: '',
  sequence: '0',
  rRule: '',
  props: null,
};

export const initialState: any = {
  modalIsOpen: false,
  hasChanged: false,
  isStartDateValid: true,
  isEndDateValid: true,
};

export const initialRRulState: any = {
  freq: 'none',
  wkst: '',
  count: null,
  interval: '1',
  until: null,
  dtstart: '',
  dtend: '',
  text: '',
};
