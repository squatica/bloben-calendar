import ICalParser from 'ical-js-parser';

import { BLOBEN_EVENT_KEY } from '../enums';
import { DateTime } from 'luxon';
import { InitialForm } from '../views/event/editEvent/editEventHelper';
import { forEach, map } from 'lodash';
import { formatAppAlarm, getLocalTimezone } from './common';
import { v4 } from 'uuid';
import Datez from 'datez';
import LuxonHelper, { ICAL_FORMAT } from './LuxonHelper';

export type CalendarMethod = 'REQUEST' | 'REPLY';
export const CALENDAR_REQUEST_METHOD: CalendarMethod = 'REQUEST';
export const CALENDAR_REPLY_METHOD: CalendarMethod = 'REPLY';

/**
 * Remove undefined props
 */
export const getKnownProps = (item: any, type = 'VEVENT') => {
  const result: any = {};
  // Strip any methods
  const clone: any = JSON.parse(JSON.stringify(item));

  result['begin'] = type;

  let index = 0;
  let hasEnd = false;

  for (const [key, value] of Object.entries(clone)) {
    index += 1;
    if (index === 1) {
      if (key !== 'begin') {
        result['begin'] = type;
      }
    }
    if (value) {
      result[key] = value;
    }
    if (key === 'end') {
      hasEnd = true;
    }
  }

  if (!hasEnd) {
    result['end'] = type;
  }

  return result;
};

interface IcalHelperInterface extends InitialForm {
  externalID: string;
}

export const formatIcalDate = (date: string, timezone?: string | null) => {
  if (!date) {
    return undefined;
  }

  if (timezone) {
    return Datez.fromISO(date, { zone: timezone }).toFormat(ICAL_FORMAT);
  }

  return date;
};

class ICalHelper {
  dtstart: any;
  dtend: any;
  dtstamp?: string;
  organizer?: any;
  uid?: string;
  attendee?: any;
  created?: string;
  description?: string;
  lastModified?: string;
  location?: string;
  sequence?: string;
  color?: string;
  status?: string;
  summary?: string;
  transp?: string;
  rrule?: string;
  props?: any;
  recurrenceID?: any;
  [key: string]: any;

  constructor(event: IcalHelperInterface, timezone: string) {
    const {
      externalID,
      createdAt,
      updatedAt,
      startAt,
      endAt,
      summary,
      color,
      description,
      location,
      rRule,
      timezoneStartAt,
      timezoneEndAt,
      organizer,
      attendees,
      props,
      allDay,
      alarms,
      recurrenceID,
      sequence,
      exdates,
      valarms,
    } = event;

    this.dtstart = {
      value: allDay
        ? DateTime.fromISO(startAt).toFormat('yyyyMMdd')
        : formatIcalDate(
            startAt,
            timezoneStartAt || timezone || getLocalTimezone()
          ),
      timezone: allDay
        ? undefined
        : timezoneStartAt || timezone || getLocalTimezone(),
    };
    this.dtend = {
      value: allDay
        ? DateTime.fromISO(endAt).plus({ day: 1 }).toFormat('yyyyMMdd')
        : formatIcalDate(
            endAt,
            timezoneEndAt || timezoneStartAt || timezone || getLocalTimezone()
          ),
      timezone: allDay
        ? undefined
        : timezoneEndAt || timezoneStartAt || timezone || getLocalTimezone(),
    };
    this.uid = externalID ? externalID : v4();
    if (attendees?.length) {
      this.attendee = attendees;
    }

    if (organizer) {
      this.organizer = organizer;
    }
    this.created = LuxonHelper.toUtcString(createdAt);
    this.dtstamp = DateTime.local().toUTC().toString();
    this.description = description;
    this.lastModified = LuxonHelper.toUtcString(updatedAt);
    this.rrule =
      rRule && rRule !== ''
        ? // eslint-disable-next-line @typescript-eslint/no-use-before-define
          rRule
        : undefined;
    this.summary = summary;
    this.location = location;
    // this.sequence = sequence;
    this.status = 'CONFIRMED';
    this.transp = 'OPAQUE';

    if (color) {
      this.color = color;
    }

    if (exdates) {
      this.exdate = exdates;
    }

    if (valarms?.length) {
      this.alarms = valarms;
    }

    if (recurrenceID) {
      this.recurrenceId = {
        value:
          formatIcalDate(recurrenceID?.value, timezone) ||
          formatIcalDate(recurrenceID, timezone),
        timezone: allDay ? undefined : timezoneStartAt,
      };
    }

    // include all other not supported properties
    if (props) {
      forEach(Object.entries(props), (propItem) => {
        if (propItem[0] === 'sequence') {
          if (sequence) {
            this.sequence = String(Number(propItem[1]));
          } else {
            this[propItem[0]] = String(Number(propItem[1]) + 1);
          }
        } else if (
          propItem[0] === BLOBEN_EVENT_KEY.INVITE_FROM ||
          propItem[0] === BLOBEN_EVENT_KEY.INVITE_TO
        ) {
          this[propItem[0]] = propItem[1];
        }
      });
    }

    // format alarms
    if (alarms?.length) {
      this.alarms = map(alarms, formatAppAlarm);
    }

    if (!this.sequence) {
      this.sequence = '0';
    }
  }

  private createCalendar = (method?: CalendarMethod) => {
    if (method) {
      return {
        begin: 'BEGIN:VCALENDAR',
        prodid: 'Bloben 1.0',
        method: method,
        calscale: 'GREGORIAN',
        version: '2.0',
        end: 'END:VCALENDAR',
      };
    } else {
      return {
        begin: 'BEGIN:VCALENDAR',
        prodid: 'Bloben 1.0',
        // method: 'REQUEST',
        calscale: 'GREGORIAN',
        version: '2.0',
        end: 'END:VCALENDAR',
      };
    }
  };

  public getEventJSON = () => {
    return getKnownProps(this);
  };

  public parseTo = (method?: CalendarMethod) => {
    const template = {
      calendar: this.createCalendar(method),
      events: [getKnownProps(this)],
    };

    return ICalParser.toString(template);
  };
}

export default ICalHelper;
