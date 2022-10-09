import ICalParser from 'ical-js-parser';

import { DateTime } from 'luxon';
import { InitialForm } from '../views/event/editEvent/editEventHelper';
import { forEach, map } from 'lodash';
import { formatAppAlarm } from './common';
import { formatIcalDate, getKnownProps } from './ICalHelper';
import { v4 } from 'uuid';
import LuxonHelper from './LuxonHelper';

export type CalendarMethod = 'REQUEST' | 'REPLY';
export const CALENDAR_REQUEST_METHOD: CalendarMethod = 'REQUEST';
export const CALENDAR_REPLY_METHOD: CalendarMethod = 'REPLY';

interface IcalHelperInterface extends InitialForm {
  externalID: string;
}

class ICalHelper {
  dtstart: any;
  dtstamp?: string;
  uid?: string;
  created?: string;
  description?: string;
  lastModified?: string;
  sequence?: string;
  summary?: string;
  rrule?: string;
  props?: any;
  status: string | undefined;
  recurrenceID?: any;
  [key: string]: any;

  constructor(event: IcalHelperInterface, timezone?: string) {
    const {
      externalID,
      createdAt,
      updatedAt,
      startAt,
      summary,
      description,
      rRule,
      props,
      allDay,
      alarms,
      recurrenceID,
      sequence,
      exdates,
      valarms,
      status,
    } = event;

    this.dtstart = {
      value: allDay ? DateTime.fromISO(startAt).toFormat('yyyyMMdd') : startAt,
      timezone: undefined,
    };
    this.uid = externalID ? externalID : v4();

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
    this.status = 'NEEDS-ACTION';
    // this.sequence = sequence;

    if (exdates) {
      this.exdate = exdates;
    }

    if (valarms?.length) {
      this.alarms = valarms;
    }

    if (status) {
      this.status = status;
    }

    if (recurrenceID) {
      this.recurrenceId = {
        value:
          formatIcalDate(recurrenceID?.value, timezone) ||
          formatIcalDate(recurrenceID, timezone),
        timezone: undefined,
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
      todos: [getKnownProps(this, 'VTODO')],
    };

    return ICalParser.toString(template);
  };
}

export default ICalHelper;
