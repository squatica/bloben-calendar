import { DateTime } from 'luxon';
import React, { useContext } from 'react';

import './TimePickerUnit.scss';

import { Context } from '../../../context/store';
import ButtonBase from '../../button/buttonBase/ButtonBase';

interface TimePickerUnitProps {
  selectedDate: string;
  selectValue: any;
  value: string;
  keyPrefix: string;
}
const TimePickerUnit = (props: TimePickerUnitProps) => {
  const { selectedDate, selectValue, value, keyPrefix } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  const key = `${keyPrefix}_${value}`;

  const isSelected: boolean =
    // @ts-ignore
    value === (DateTime.fromISO(selectedDate)[keyPrefix] as string);

  const onClick = () => {
    const timeValues: string[] = value.split(':');
    let newDate: DateTime = DateTime.fromISO(selectedDate);

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
      key={key}
      isDark={isDark}
      id={key}
      onClick={onClick}
      className={`TimePickerUnit${isSelected ? '-selected' : ''}`}
    >
      {value}
    </ButtonBase>
  );
};

export default TimePickerUnit;
