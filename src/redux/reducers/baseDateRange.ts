import { DateTime } from 'luxon';
import { OnPageChangeData } from 'kalend';

export const initBaseDateRange = () => {
  const currentDate = DateTime.now();

  return {
    rangeFrom: currentDate
      .set({ day: 1 })
      .minus({ days: 15 })
      .toUTC()
      .toString(),
    rangeTo: currentDate.endOf('month').plus({ days: 15 }).toUTC().toString(),
    direction: 'today',
  };
};

export const inInBaseDateRange = (
  baseDateRange: OnPageChangeData = initBaseDateRange(),
  pageRange: OnPageChangeData
) => {
  const baseStart = DateTime.fromISO(baseDateRange.rangeFrom).toMillis();
  const baseEnd = DateTime.fromISO(baseDateRange.rangeTo).toMillis();

  const pageStart = DateTime.fromISO(pageRange.rangeFrom).toMillis();
  const pageEnd = DateTime.fromISO(pageRange.rangeTo).toMillis();

  if (pageEnd < baseStart || pageStart > baseEnd) {
    return false;
  }

  return true;
};

const BaseDateRange = (
  state: OnPageChangeData = initBaseDateRange(),
  action: any
) => {
  switch (action.type) {
    case 'SET_BASE_DATE_RANGE':
      return action.payload;
    default:
      return state;
  }
};

export default BaseDateRange;
