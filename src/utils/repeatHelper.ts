import { CalDavEvent } from '../types/interface';
import { DateTime } from 'luxon';
import { OnPageChangeData } from 'kalend';
import { RRule } from 'rrule';
import { cloneDeep, forEach } from 'lodash';
import { getLocalTimezone } from './common';
import { v4 } from 'uuid';
import LuxonHelper from './LuxonHelper';

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

export const formatToRRule = (rRule: string, date: string) => {
  const dateFormatted = formatIsoDateToRRuleDate(date);
  const rRuleParsed: string = parseUntilRRuleValue(rRule);
  return `DTSTART:${dateFormatted}\nRRULE:${rRuleParsed}`;
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

export const getRepeatedEvents = (
  event: CalDavEvent,
  range: OnPageChangeData
) => {
  const rangeFromDateTime = DateTime.fromISO(range.rangeFrom);
  const rangeToDateTime = DateTime.fromISO(range.rangeTo);

  const result: any = [];

  if (!event.rRule) {
    return result;
  }

  const rRule = RRule.fromString(formatToRRule(event.rRule, event.startAt));

  const diffInMinutes: number = LuxonHelper.getDiffInMinutes(
    event.startAt,
    event.endAt
  );

  // check if event starts in DST
  const eventStartsInDST: boolean = DateTime.fromISO(event.startAt).setZone(
    event.timezone || getLocalTimezone()
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
      event.timezone || getLocalTimezone()
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
    eventClone.endAt = LuxonHelper.addMinutes(
      startAtDateTime.toString(),
      diffInMinutes
    )
      .toUTC()
      .toString();

    if (!isException(rRuleResult, event)) {
      result.push(eventClone);
    }
  });

  return result;
};
