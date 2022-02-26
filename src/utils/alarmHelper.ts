/* eslint-disable */
import { ALARM_DURATION } from '../types/enums';
import { CalDavEvent, Duration } from '../types/interface';
import { DateTime, DurationInput } from 'luxon';
import { forEach } from 'lodash';
import { isNumber } from './common';

export const formatToNotificationDateKey = (date: DateTime): string =>
  date.toFormat('yyyyMMdd:HHmm');

const parseDurationString = (value: string): ALARM_DURATION => {
  if (value === 'D') {
    return ALARM_DURATION.DAY;
  } else if (value === 'W') {
    return ALARM_DURATION.WEEK;
  } else if (value === 'H') {
    return ALARM_DURATION.HOUR;
  } else if (value === 'M') {
    return ALARM_DURATION.MINUTE;
  } else if (value === 'S') {
    return ALARM_DURATION.SECOND;
  }

  return ALARM_DURATION.MINUTE;
};

// const parseAlarmDuration = (trigger: string): Duration => {
//   const result: Duration = {};
//
//   let currentKey: ALARM_DURATION | undefined;
//   forEach(trigger, (letter: string) => {
//     if (!isNumber(letter)) {
//       currentKey = parseDurationString(letter);
//     } else {
//       if (currentKey) {
//         result[currentKey] = Number(letter);
//       }
//     }
//   });
//
//   return result;
// };

// const getDateTimeDuration = (duration: Duration): DurationInput => {
//   const result: any = {};
//
//   forEach(duration, (value, key) => {
//     result[key] = value;
//   });
//
//   return result;
// };

export const getAlarmTriggerTimes = (event: CalDavEvent) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  forEach(event.alarms, (alarm) => {
    // const isBefore: boolean = alarm.trigger.slice(0, 1) === '-';
    //
    // const duration = parseAlarmDuration(alarm.trigger);
    //
    // const startAtDateTime: DateTime = parseToDateTime(
    //   event.startAt,
    //   event.timezone || getLocalTimezone()
    // );
    // const dateTimeDuration = getDateTimeDuration(duration);
    // let date: string;
    //
    // if (isBefore) {
    //   date = formatToNotificationDateKey(
    //     startAtDateTime.minus(dateTimeDuration)
    //   );
    // } else {
    //   date = formatToNotificationDateKey(
    //     startAtDateTime.plus(dateTimeDuration)
    //   );
    // }
    // addNotification({
    //   date,
    //   eventID: event.id,
    //   alarm,
    //   summary: event.summary,
    // });
  });
};
