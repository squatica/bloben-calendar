import React, { useEffect } from 'react';

import './TimePickerList.scss';
import { DateTime } from 'luxon';
import TimePickerUnit from '../timePickerUnit/TimePickerUnit';

const renderTimePickerUnits = (
  selectedDate: DateTime,
  selectTime: any,
  timezone: string
) => {
  const timeUnits: string[] = [];
  const idRefs: string[] = [];
  for (let i = 0; i < 24; i++) {
    let result = '';

    const withZeroPrefix: boolean = i < 10;

    if (withZeroPrefix) {
      result += '0';
    }

    timeUnits.push(`${result}${i}  :  00`);
    timeUnits.push(`${result}${i}  :  30`);
    idRefs.push(`${i}_00`);
    idRefs.push(`${i}_30`);
  }

  return timeUnits.map((timeUnit: string, index) => (
    <TimePickerUnit
      key={idRefs[index]}
      id={idRefs[index]}
      keyPrefix={'timeUnit'}
      value={String(timeUnit)}
      selectedDate={selectedDate}
      selectValue={selectTime}
      timezone={timezone}
    />
  ));
};

interface TimePickerViewProps {
  selectedDate: DateTime;
  selectTime: any;
  timezone: string;
}
const TimePickerList = (props: TimePickerViewProps) => {
  const { selectedDate, selectTime, timezone } = props;

  const timePickerUnits: any = renderTimePickerUnits(
    selectedDate,
    selectTime,
    timezone
  );

  useEffect(() => {
    const dateRef = selectedDate;

    // if (timezone !== FLOATING_DATETIME) {
    //   dateRef.setZone(timezone);
    // } else {
    //   dateRef = selectedDate.setZone(UTC_TIMEZONE);
    // }

    const hourEl: any = document.getElementById(`${dateRef.hour}_00`);
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
