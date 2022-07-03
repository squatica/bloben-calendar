import React, { useEffect } from 'react';

import './TimePickerList.scss';
import { DateTime } from 'luxon';
import TimePickerUnit from '../timePickerUnit/TimePickerUnit';

const renderTimePickerUnits = (selectedDate: string, selectTime: any) => {
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
