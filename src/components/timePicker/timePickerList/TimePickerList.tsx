import React, { useEffect } from 'react';

import './TimePickerList.scss';
import { DateTime } from 'luxon';
import TimePickerUnit from '../timePickerUnit/TimePickerUnit';

const renderTimePickerUnits = (selectedDate: string, selectTime: any) => {
  const timeUnits: string[] = [];
  for (let i = 0; i < 24; i++) {
    let result = '';

    const withZeroPrefix: boolean = i < 10;

    if (withZeroPrefix) {
      result += '0';
    }

    timeUnits.push(`${result}${i}:00`);
    timeUnits.push(`${result}${i}:30`);
  }

  return timeUnits.map((timeUnit: string) => (
    <TimePickerUnit
      key={`hour_${timeUnit}`}
      keyPrefix={'timeUnit'}
      value={String(timeUnit)}
      selectedDate={selectedDate}
      selectValue={selectTime}
    />
  ));
};

interface TimePickerViewProps {
  selectedDate: any;
  selectTime: any;
}
const TimePickerList = (props: TimePickerViewProps) => {
  const { selectedDate, selectTime } = props;

  const timePickerUnits: any = renderTimePickerUnits(selectedDate, selectTime);

  useEffect(() => {
    const dateRef: DateTime = DateTime.fromISO(selectedDate);
    const hourEl: any = document.getElementById(`hour_${dateRef.hour}`);
    const minuteEl: any = document.getElementById(`minute_${dateRef.minute}`);

    if (hourEl) {
      hourEl.scrollIntoView();
    }
    if (minuteEl) {
      minuteEl.scrollIntoView();
    }
  }, []);

  return (
    <div className={'TimePickerList__wrapper'}>
      <div
        id={'TimePickerList__container-hours'}
        className={'TimePickerList__container'}
      >
        {timePickerUnits}
      </div>
    </div>
  );
};

export default TimePickerList;
