import { DATE_MONTH_YEAR_FORMAT } from '../../../utils/LuxonHelper';
import { DateTime } from 'luxon';

export const repeatOptions: any = [
  { label: 'No repeat', value: 'none' },
  { label: 'day', value: 'RRULE:FREQ=DAILY;INTERVAL=1' },
  { label: 'week', value: 'RRULE:FREQ=WEEKLY;INTERVAL=1' },
  { label: 'month', value: 'RRULE:FREQ=MONTHLY;INTERVAL=1' },
  { label: 'yearly', value: 'RRULE:FREQ=YEARLY;INTERVAL=1' },
  { label: 'custom', value: 'custom' },
];

export const parseFreqInterval = (freq: string, interval: any): string => {
  switch (freq.toUpperCase()) {
    case 'DAILY':
      return interval && interval > 1 ? `${interval} days` : 'day';
    case 'WEEKLY':
      return interval && interval > 1 ? `${interval} weeks` : 'week';
    case 'MONTHLY':
      return interval && interval > 1 ? `${interval} months` : 'month';
    default:
      return `${interval} ${freq.toLowerCase()}`;
  }
};

export const parseRepeatTill = (until: string, count: any): string => {
  if (count) {
    return `for ${count} time${count === 1 ? '' : 's'}`;
  }

  return `until ${DateTime.fromISO(until).toFormat(DATE_MONTH_YEAR_FORMAT)}`;
};

/**
 * Parse rRule object to readable format
 * @param rRule
 */
export const parseRRuleText = (rRule: any) => {
  const { freq, interval, until, count } = rRule;

  const isInfinite = until !== undefined || until !== '' || until !== null;

  return `
  Repeat every ${parseFreqInterval(freq, interval)} ${
    isInfinite ? '' : parseRepeatTill(until, count)
  }
  `;
};
