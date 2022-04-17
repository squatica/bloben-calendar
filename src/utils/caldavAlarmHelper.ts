import { ALARM_TYPE } from '../bloben-interface/enums';
import { AppAlarm } from './common';
import { DateTime } from 'luxon';
import { forEach } from 'lodash';
import { v4 } from 'uuid';

export enum ALARM_DURATION {
  DAY = 'days',
  SECOND = 'seconds',
  MINUTE = 'minutes',
  HOUR = 'hours',
  WEEK = 'weeks',
}
export interface Duration {
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export const formatToNotificationDateKey = (date: DateTime): string =>
  date.toFormat('yyyyMMdd:HHmm');

export const parseToAlarmTrigger = (alarm: AppAlarm): string => {
  return `${alarm.isBeforeEvent ? '-' : ''}PT${alarm.amount}${alarm.timeUnit
    .slice(0, 1)
    .toUpperCase()}`;
};

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

export const parseAlarmDuration = (trigger: string): Duration | null => {
  const result: Duration = {};

  if (!trigger) {
    return null;
  }

  let currentKey: ALARM_DURATION | undefined;
  let numberValue = '';
  forEach(trigger, (letter: string) => {
    if (isNaN(Number(letter))) {
      currentKey = parseDurationString(letter);
    } else {
      numberValue = `${numberValue}${letter}`;
    }
  });

  if (currentKey && numberValue !== '') {
    result[currentKey] = Number(numberValue);

    return result;
  }

  return null;
};

export const parseIcalAlarmToAppAlarm = (alarm: any) => {
  const duration = parseAlarmDuration(alarm.trigger);
  const isBefore: boolean = alarm?.trigger?.slice(0, 1) === '-';

  if (duration && alarm?.trigger) {
    const entries = Object.entries(duration);

    return {
      id: v4(),
      amount: Number(entries[0][1]),
      timeUnit: entries[0][0],
      isBeforeEvent: isBefore,
      type:
        alarm.xBlobenAlarmType || alarm.xblobenalarmtype
          ? alarm.xBlobenAlarmType || alarm.xblobenalarmtype
          : ALARM_TYPE.PUSH,
    };
  }
};

// const getDateTimeDuration = (duration: Duration): DurationInput => {
//   const result: any = {};
//
//   forEach(duration, (value, key) => {
//     result[key] = value;
//   });
//
//   return result;
// };

// export const getAlarmTriggerTimes = (event: C) => {
//   forEach(event.alarms, (alarm) => {
//     const isBefore: boolean = alarm.trigger.slice(0, 1) === '-';
//
//     const duration = parseAlarmDuration(alarm.trigger);
//
//     const startAtDateTime: DateTime = parseToDateTime(
//       event.startAt,
//       event.timezone || getLocalTimezone()
//     );
//     const dateTimeDuration = getDateTimeDuration(duration);
//
//     let date: string;
//
//     if (isBefore) {
//       date = formatToNotificationDateKey(
//         startAtDateTime.minus(dateTimeDuration)
//       );
//     } else {
//       date = formatToNotificationDateKey(
//         startAtDateTime.plus(dateTimeDuration)
//       );
//     }
//
//     addNotification({
//       date,
//       eventID: event.id,
//       alarm,
//       summary: event.summary,
//     });
//   });
// };
