import { CALDAV_OBJ_TYPE } from '../types/enums';
import { CalDavQueryResult, QueryRange } from '../types/interface';
import { DAVCalendarObject } from 'tsdav';
import { DateTime } from 'luxon';
import { RRule } from 'rrule';
import { cloneDeep, forEach } from 'lodash';
import { v4 } from 'uuid';
import ICalParser, { EventJSON } from 'ical-js-parser';
import LuxonHelper from './LuxonHelper';

export const parseUntilRRuleValue = (rRule: string): string => {
  const indexOfUntil: number = rRule.indexOf('UNTIL=');

  if (indexOfUntil === -1) {
    return rRule;
  }

  const partBefore: string = rRule.slice(0, indexOfUntil);
  const partAfter: string = rRule.slice(partBefore.length);
  const delimiterIndex: number = partAfter.indexOf(';');
  const untilDatePart: string = formatIsoDateToRRuleDate(
    partAfter.slice('UNTIL='.length, delimiterIndex)
  );

  const restPart: string = partAfter.slice(delimiterIndex);

  const result = `${partBefore}UNTIL=${untilDatePart}${restPart}`;

  return result;
};

const formatIsoDateToRRuleDate = (date: string) => {
  let result = '';
  for (let i = 0; i < date.length; i++) {
    const letter: string = date[i];

    if (letter !== ':' && letter !== '-' && letter !== '.' && letter !== 'Z') {
      result += letter;
    }
  }

  if (result.length > 15) {
    return result.slice(0, 15);
  }

  return result;
};

export const formatToRRule = (rRule: string, date: string) => {
  const dateFormatted = formatIsoDateToRRuleDate(date);
  const rRuleParsed: string = parseUntilRRuleValue(rRule);
  return `DTSTART:${dateFormatted}\nRRULE:${rRuleParsed}`;
};

export interface CalDavEventObj {
  id: string;
  calendarUrl: string;
  startAt: string;
  endAt: string;
  timezone: string | null;
  isRepeated: boolean;
  summary: string;
  location: string | null;
  description: string | null;
  etag: string;
  color: string;
  alarms: any;
  rRule: string | null;
  href: string;
  [key: string]: any;
}

const formatEventJsonToCalDavEvent = (
  event: EventJSON,
  calendarObject: DAVCalendarObject,
  calendar: any
): CalDavEventObj => {
  return {
    ...{ ...calendarObject, data: null }, // clear ical data prop
    calendarUrl: calendar.url,
    id: event.uid || '',
    startAt: event.dtstart.value,
    endAt: event.dtend.value,
    timezone: event.dtstart.timezone || null,
    isRepeated: event.rrule !== undefined || false,
    rRule: event.rrule || null,
    summary: event.summary || '',
    location: event.location || null,
    description: event.description || null,
    etag: calendarObject.etag,
    color: calendar.calendarColor || 'indigo',
    alarms: event.alarms,
    href: calendarObject.url,
    originalData: event,
  };
};

const isException = (date: Date, event: any): boolean => {
  if (!event.exceptions || event.exceptions.length === 0) {
    return false;
  }

  const dateString: string = date.toISOString();
  if (event.exceptions.includes(dateString)) {
    return true;
  }

  return false;
};

export const getRepeatedEvents = (event: any, range: any) => {
  const rangeFromDateTime = DateTime.fromISO(range.rangeFrom);
  const rangeToDateTime = DateTime.fromISO(range.rangeTo);

  const result: any = [];

  if (!event.rRule) {
    return result;
  }

  const rRule = RRule.fromString(formatToRRule(event.rRule, event.startAt));

  const diffInMinutes: number = LuxonHelper.getDiffInMinutes2(
    event.startAt,
    event.endAt
  );

  // check if event starts in DST
  const eventStartsInDST: boolean = DateTime.fromISO(event.startAt).setZone(
    event.timezone || 'Europe/Berlin'
  ).isInDST;

  const rRuleResults: Date[] = rRule.between(
    new Date(
      rangeFromDateTime.year,
      rangeFromDateTime.month - 1,
      rangeFromDateTime.day,
      rangeFromDateTime.hour,
      rangeFromDateTime.minute
    ),
    new Date(
      rangeToDateTime.year,
      rangeToDateTime.month - 1,
      rangeToDateTime.day,
      rangeToDateTime.hour,
      rangeToDateTime.minute
    )
  );

  forEach(rRuleResults, (rRuleResult: Date) => {
    const eventClone = cloneDeep(event);

    let startAtDateTime: DateTime = DateTime.fromISO(rRuleResult.toISOString());

    // check if start of repeated event is in DST
    const repeatedEventStartsInDST: boolean = startAtDateTime.setZone(
      event.timezone || 'Europe/Berlin'
    ).isInDST;

    // set proper "wall" time for repeated dates across DST changes
    if (!eventStartsInDST && repeatedEventStartsInDST) {
      startAtDateTime = startAtDateTime.minus({ hours: 1 });
    }

    if (eventStartsInDST && !repeatedEventStartsInDST) {
      startAtDateTime = startAtDateTime.plus({ hours: 1 });
    }

    eventClone.internalID = v4();
    eventClone.startAt = startAtDateTime.toUTC().toString();
    eventClone.endAt = startAtDateTime
      .plus({ minutes: diffInMinutes })
      .toUTC()
      .toString();

    if (!isException(rRuleResult, event)) {
      result.push(eventClone);
    }
  });

  return result;
};

const getRepeatedEvent = (events: EventJSON[]): EventJSON => {
  const result = events.filter((event) => {
    if (event.rrule) {
      return event;
    }
  });

  return result[0];
};

// Note id and url are not linked
export const createEventFromCalendarObject = (
  calendarObject: DAVCalendarObject,
  calendar: any
  // range?: Range
) => {
  const icalJS = ICalParser.toJSON(calendarObject.data);
  const event = icalJS.events?.[0];

  if (event) {
    return formatEventJsonToCalDavEvent(event, calendarObject, calendar);
  }
};

export const createEventWithRepeats = (
  event: CalDavEventObj,
  range: QueryRange
): CalDavEventObj[] => {
  const repeatedEvents: any = getRepeatedEvents(event, range);

  // TODO
  // now find if there is recurrence id for that date and use it instead
  // of calculated result

  // save both original and repeated clones

  const mergedEvents: CalDavEventObj[] =
    repeatedEvents.length > 0 ? repeatedEvents : [event];

  return mergedEvents;
};

// Note id and url are not linked
export const createItemsFromCalendarObject = (
  calendarObject: DAVCalendarObject,
  calendar: any,
  range?: any
): CalDavQueryResult | undefined => {
  const icalJS = ICalParser.toJSON(calendarObject.data);
  const event = icalJS.events?.[0];

  if (event) {
    if (range) {
      // if there are more than one event, it means others are occurrences
      if (event.rrule && event.rrule !== '') {
        // find event with rrule prop to calculate occurrences
        const eventWithRRule = formatEventJsonToCalDavEvent(
          getRepeatedEvent(icalJS.events as EventJSON[]),
          calendarObject,
          calendar
        );

        const repeatedEvents = getRepeatedEvents(eventWithRRule, range);

        // now find if there is recurrence id for that date and use it instead
        // of calculated result

        // save both original and repeated clones
        const mergedEvents =
          repeatedEvents.length > 0 ? repeatedEvents : [eventWithRRule];

        return {
          type: CALDAV_OBJ_TYPE.EVENT,
          data: mergedEvents,
        };
      }
    }

    return {
      type: CALDAV_OBJ_TYPE.EVENT,
      data: [formatEventJsonToCalDavEvent(event, calendarObject, calendar)],
    };
  }

  return undefined;
};
