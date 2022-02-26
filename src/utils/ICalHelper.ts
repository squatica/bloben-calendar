import ICalParser from 'ical-js-parser-commonjs';

import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import LuxonHelper from './LuxonHelper';

export type CalendarMethod = 'REQUEST' | 'REPLY';
export const CALENDAR_REQUEST_METHOD: CalendarMethod = 'REQUEST';
export const CALENDAR_REPLY_METHOD: CalendarMethod = 'REPLY';

/**
 * Remove undefined props
 */
const getKnownProps = (item: any, type = 'VEVENT') => {
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
  status?: string;
  summary?: string;
  transp?: string;
  rrule?: string;

  constructor(event: any) {
    const {
      id,
      createdAt,
      updatedAt,
      startAt,
      endAt,
      summary,
      description,
      location,
      rRule,
      timezoneStart,
      organizer,
      attendees,
      sequence,
    } = event;

    this.dtstart = {
      value: LuxonHelper.toUtcString(startAt),
      timezone: timezoneStart,
    };
    this.dtend = {
      value: LuxonHelper.toUtcString(endAt),
      timezone: timezoneStart,
    };
    this.uid = id ? id : v4();
    this.organizer = organizer;
    this.attendee = attendees;
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
    this.sequence = sequence;
    this.status = 'CONFIRMED';
    this.transp = 'OPAQUE';
  }

  private createCalendar = (method?: CalendarMethod) => {
    if (method) {
      return {
        begin: 'BEGIN:VCALENDAR',
        prodid: 'Calendar 1.0',
        method: method,
        calscale: 'GREGORIAN',
        version: '2.0',
        end: 'END:VCALENDAR',
      };
    } else {
      return {
        begin: 'BEGIN:VCALENDAR',
        prodid: 'Calendar 1.0',
        // method: method,
        calscale: 'GREGORIAN',
        version: '2.0',
        end: 'END:VCALENDAR',
      };
    }
  };

  public parseTo = (method?: CalendarMethod) => {
    const template = {
      calendar: this.createCalendar(method),
      events: [getKnownProps(this)],
      todos: [],
    };

    return ICalParser.toString(template);
  };
}

export default ICalHelper;
