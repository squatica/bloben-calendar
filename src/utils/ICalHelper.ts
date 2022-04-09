import ICalParser from 'ical-js-parser-dev';

import { DateTime } from 'luxon';
import { forEach, map } from 'lodash';
import { formatAppAlarm } from './common';
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
  color?: string;
  status?: string;
  summary?: string;
  transp?: string;
  rrule?: string;
  props?: any;
  [key: string]: any;

  constructor(event: any) {
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
      organizer,
      attendees,
      props,
      allDay,
      alarms,
    } = event;

    this.dtstart = {
      value: allDay
        ? DateTime.fromISO(startAt).toFormat('yyyyMMdd')
        : LuxonHelper.toUtcString(startAt),
      timezone: allDay ? undefined : timezoneStartAt,
    };
    this.dtend = {
      value: allDay
        ? DateTime.fromISO(endAt).plus({ day: 1 }).toFormat('yyyyMMdd')
        : LuxonHelper.toUtcString(endAt),
      timezone: allDay ? undefined : timezoneStartAt,
    };
    this.uid = externalID ? externalID : v4();
    if (attendees.length) {
      this.organizer = organizer || props?.organizer;
      this.attendee = attendees;
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

    // include all other not supported properties
    if (props) {
      forEach(Object.entries(props), (propItem) => {
        if (propItem[0] === 'sequence') {
          this[propItem[0]] = String(Number(propItem[1]) + 1);
        } else {
          if (propItem[0] === 'alarms' && alarms?.length === 0) {
            this.alarms = propItem[1];
          } else if (propItem[0] !== 'attendee') {
            this[propItem[0]] = propItem[1];
          }
        }
      });
    }

    // format alarms
    if (alarms.length) {
      this.alarms = map(alarms, formatAppAlarm);
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

  public parseTo = (method?: CalendarMethod) => {
    const template = {
      calendar: this.createCalendar(method),
      events: [getKnownProps(this)],
    };

    return ICalParser.toString(template);
  };
}

export default ICalHelper;
