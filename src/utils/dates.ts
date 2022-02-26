import { DateTime, Interval } from 'luxon';
import { forEach } from 'lodash';
import { parseToDateTime } from './datetimeParser';

export const checkOverlappingEvents = (eventA: any, eventB: any): boolean => {
  const startAtFirst: DateTime = DateTime.fromISO(eventA.startAt);
  const endAtFirst: DateTime = DateTime.fromISO(eventA.endAt);

  return Interval.fromDateTimes(startAtFirst, endAtFirst).overlaps(
    Interval.fromDateTimes(
      DateTime.fromISO(eventB.startAt),
      DateTime.fromISO(eventB.endAt)
    )
  );
};

export const checkOverlappingDatesForHeaderEvents = (
  event: any,
  day: DateTime
): boolean => {
  const dateStart = parseToDateTime(event.startAt, event.timezoneStart);
  const dateEnd = parseToDateTime(event.endAt, event.timezoneStart);
  const dayTruncated: number = parseToDateTime(day, event.timezoneStart)
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();

  const eventStartTruncated: number = dateStart
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();
  const eventEndTruncated: number = dateEnd
    .set({ hour: 0, minute: 0, millisecond: 0, second: 0 })
    .toMillis();

  // fix wrong positioning when external all day event ends in next day
  if (event.externalID) {
    return (
      dayTruncated >= eventStartTruncated && dayTruncated < eventEndTruncated
    );
  } else {
    return (
      dayTruncated >= eventStartTruncated && dayTruncated <= eventEndTruncated
    );
  }
};

export const isEventInRange = (event: any, days: any): boolean => {
  let hasMatch = false;
  forEach(days, (day) => {
    if (checkOverlappingDatesForHeaderEvents(event, day)) {
      hasMatch = true;
      return false;
    }
  });

  return hasMatch;
};

export const formatToIcalDateString = (date: string): string =>
  DateTime.fromISO(date).toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

const calculateMondayStartWeekDay = (date: DateTime): DateTime[] => {
  const days = [];
  const dayInWeek = date.weekday;
  const startDate = date.minus({ days: dayInWeek - 1 });

  if (Number(dayInWeek) === 0) {
    for (let i = 6; i > 0; i--) {
      days.push(date.minus({ days: i }));
    }
    days.push(date);
  } else {
    days.push(startDate);
    for (let i = 1; i < 7; i++) {
      days.push(startDate.plus({ days: i }));
    }
  }

  return days;
};

const calculateSundayStartWeekDay = (date: DateTime): DateTime[] => {
  const days = [];
  const dayInWeek = date.weekday;
  const startDate =
    dayInWeek === 7
      ? date.plus({ days: dayInWeek - 7 })
      : date.minus({ days: dayInWeek });

  if (dayInWeek === 7) {
    for (let i = 6; i > 0; i--) {
      days.push(date.minus({ days: i }));
    }
    days.push(date);
  } else {
    days.push(startDate);
    for (let i = 1; i < 7; i++) {
      days.push(startDate.plus({ days: i }));
    }
  }

  return days;
};

export const getWeekDays = (
  date: DateTime,
  weekDayStart: string
): DateTime[] => {
  if (weekDayStart === 'monday') {
    return calculateMondayStartWeekDay(date);
  } else {
    return calculateSundayStartWeekDay(date);
  }
};
const getFirstDayOfMonth = (date: DateTime): DateTime => date.set({ day: 1 });

export const calculateMonthDays = (
  date: DateTime,
  weekDayStart: string
): DateTime[] => {
  const FIVE_WEEKS_DAYS_COUNT = 36;
  // Get reference date for calculating new month

  // Get first week of current month
  const firstDayOfCurrentMonth: DateTime = getFirstDayOfMonth(date);

  const firstWeekOfCurrentMonth: DateTime[] = getWeekDays(
    firstDayOfCurrentMonth,
    weekDayStart
  );

  const monthDays: DateTime[] = firstWeekOfCurrentMonth;

  // Add missing days to month view
  for (let i = 1; i < FIVE_WEEKS_DAYS_COUNT; i += 1) {
    const day: DateTime = firstWeekOfCurrentMonth[6].plus({ days: i });
    monthDays.push(day);
  }

  return monthDays;
};
