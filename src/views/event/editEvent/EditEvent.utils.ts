import { CalDavCalendar } from '../../../types/interface';
import { DateTime } from 'luxon';
import {
  EVENT_TYPE,
  REPEATED_EVENT_CHANGE_TYPE,
} from '../../../bloben-interface/enums';
import {
  PARTSTAT_ACCEPTED,
  ROLE_REQ,
  RSVP_TRUE,
} from '../../../utils/AttendeeUtils';
import { debug } from '../../../utils/debug';
import { find } from 'lodash';
import { findItemCalendar } from './EditEvent';
import { parseToDateTime } from '../../../utils/datetimeParser';
import { v4 } from 'uuid';
import CalDavEventsApi from '../../../api/CalDavEventsApi';
import ICalHelper, { formatIcalDate } from '../../../utils/ICalHelper';

export interface InitialForm {
  prevItem: any;
  id: string;
  summary: string;
  location: string;
  description: string;
  calendarUrl: string | null;
  timezone: string | null;
  allDay: boolean;
  startAt: string;
  timezoneStartAt: string | null;
  endAt: string;
  timezoneEndAt: string | null;
  color: string | null;
  isRepeated: boolean;
  alarms: any[];
  createdAt: string;
  updatedAt: string;
  sequence: string;
  organizer: any;
  rRule: string;
  props: any;
  valarms: any;
  attendees: any;
  exdates: any;
  recurrenceID: any;
}

export const initialFormState: InitialForm = {
  prevItem: {},
  id: '',
  summary: '',
  location: ``,
  description: ``,
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
  createdAt: DateTime.local().toString(),
  updatedAt: DateTime.local().toString(),
  organizer: null,
  sequence: '0',
  rRule: '',
  props: null,
  valarms: [],
  attendees: [],
  exdates: [],
  recurrenceID: null,
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

const handleAllDayStatus = (form: InitialForm): InitialForm => {
  if (form.allDay) {
    form.startAt = parseToDateTime(form.startAt, 'floating')
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toString();
    form.endAt = parseToDateTime(form.endAt, 'floating')
      .set({
        hour: 0,
        minute: 0,
        second: 0,
      })
      .toString();

    form.timezoneStartAt = 'floating';
    form.timezoneEndAt = 'floating';
  }

  return form;
};

export const createEvent = async (
  formInitial: InitialForm,
  isNewEvent: boolean,
  calendar?: CalDavCalendar,
  handleClose?: any,
  originalEvent?: any,
  sendInvite?: boolean,
  inviteMessage?: string
) => {
  const form = handleAllDayStatus(formInitial);
  const eventCalendar: CalDavCalendar =
    calendar || findItemCalendar(originalEvent);

  const calendarChanged: boolean =
    !isNewEvent && originalEvent?.calendarID !== eventCalendar.id;

  // add organizer as attendee
  if (form.attendees.length && form.organizer) {
    // check if exists
    const organizerAttendee = find(
      form.attendees,
      (attendee) => attendee.mailto === form.organizer.mailto
    );

    if (!organizerAttendee) {
      form.attendees = [
        ...form.attendees,
        {
          CN: form.organizer.CN,
          mailto: form.organizer.mailto,
          ROLE: ROLE_REQ,
          RSVP: RSVP_TRUE,
          PARTSTAT: PARTSTAT_ACCEPTED,
        },
      ];
    }
  }

  // use issued id or create for new event
  const newEventExternalID: string = originalEvent?.externalID || v4();

  const iCalString: string = new ICalHelper({
    ...form,
    externalID: newEventExternalID,
  }).parseTo();

  debug(iCalString);

  if (isNewEvent) {
    await CalDavEventsApi.createEvent({
      calendarID: eventCalendar.id,
      iCalString,
      externalID: newEventExternalID,
      sendInvite,
      inviteMessage,
    });
  } else {
    if (calendarChanged) {
      await CalDavEventsApi.updateEvent({
        calendarID: eventCalendar.id,
        iCalString,
        externalID: newEventExternalID,
        id: originalEvent.id,
        url: originalEvent.url,
        etag: originalEvent.etag,
        prevEvent: {
          externalID: originalEvent.externalID,
          id: originalEvent.id,
          url: originalEvent.url,
          etag: originalEvent.etag,
        },
        sendInvite,
        inviteMessage,
      });
    } else {
      await CalDavEventsApi.updateEvent({
        calendarID: eventCalendar.id,
        iCalString,
        id: originalEvent.id,
        externalID: originalEvent.externalID,
        url: originalEvent.url,
        etag: originalEvent.etag,
        prevEvent: null,
        sendInvite,
        inviteMessage,
      });
    }
  }

  // Close modal
  if (handleClose) {
    handleClose();
  }
};

const formatRecurrenceID = (
  form: InitialForm,
  type: REPEATED_EVENT_CHANGE_TYPE,
  originalEvent?: any
) => {
  if (type === REPEATED_EVENT_CHANGE_TYPE.ALL) {
    return undefined;
  }

  if (form.recurrenceID) {
    return form.recurrenceID;
  } else {
    return {
      value: formatIcalDate(originalEvent.startAt, form.timezoneStartAt),
      timezone: form.timezoneStartAt,
    };
  }
};
export const updateRepeatedEvent = async (
  form: any,
  type: REPEATED_EVENT_CHANGE_TYPE,
  calendar?: CalDavCalendar,
  handleClose?: any,
  originalEvent?: any,
  sendInvite?: boolean,
  inviteMessage?: string
) => {
  const eventCalendar: CalDavCalendar =
    calendar || findItemCalendar(originalEvent);

  const calendarChanged: boolean =
    originalEvent?.calendarID !== eventCalendar.id;

  debug('original', originalEvent);

  await CalDavEventsApi.updateRepeatedEvent({
    calendarID: eventCalendar.id,
    event: {
      ...form,
      recurrenceID: formatRecurrenceID(form, type, originalEvent),
      rRule: type === REPEATED_EVENT_CHANGE_TYPE.ALL ? form.rRule : null,
      externalID: originalEvent.externalID,
      type: EVENT_TYPE.CALDAV,
      calendarID: originalEvent.calendarID,
    },
    id: originalEvent.id,
    externalID: originalEvent.externalID,
    url: originalEvent.url,
    etag: originalEvent.etag,
    type,
    prevEvent: calendarChanged
      ? {
          externalID: originalEvent.externalID,
          id: originalEvent.id,
          url: originalEvent.url,
          etag: originalEvent.etag,
        }
      : null,
    sendInvite,
    inviteMessage,
  });

  // Close modal
  if (handleClose) {
    handleClose();
  }
};
