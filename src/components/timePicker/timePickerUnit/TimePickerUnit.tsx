import { DateTime } from 'luxon';
import React, { useContext } from 'react';

import './TimePickerUnit.scss';

import { Context, StoreContext } from '../../../context/store';
import { parseCssDark } from '../../../utils/common';
import ButtonBase from '../../button/buttonBase/ButtonBase';

interface TimePickerUnitProps {
  selectedDate: DateTime;
  selectValue: any;
  value: string;
  keyPrefix: string;
  id: string;
  timezone: string;
}
const TimePickerUnit = (props: TimePickerUnitProps) => {
  const { selectedDate, selectValue, value, keyPrefix, id } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  const isSelected: boolean =
    // @ts-ignore
    value === (selectedDate[keyPrefix] as string);

  const onClick = () => {
    const timeValues: string[] = value.split(':');
    let newDate: DateTime = selectedDate;
    //
    // if (timezone !== FLOATING_DATETIME) {
    //   newDate.setZone(timezone);
    // } else {
    //   newDate = selectedDate.setZone(UTC_TIMEZONE);
    // }

    newDate = newDate.set({
      hour: Number(timeValues[0]),
      minute: Number(timeValues[1]),
    });

    if (newDate.isValid) {
      selectValue(newDate);
    }
  };

  return (
    <ButtonBase
      key={id}
      isDark={isDark}
      id={id}
      onClick={onClick}
      className={parseCssDark(
        `TimePickerUnit${isSelected ? '-selected' : ''}`,
        isDark
      )}
    >
      {value}
    </ButtonBase>
  );
};

export default TimePickerUnit;
