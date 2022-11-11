import { useSelector } from 'react-redux';
import React from 'react';

import './TimePicker.scss';
import { DateTime } from 'luxon';
import { useWidth } from '../../utils/layout';
import TimeInput from './timeInput/TimeInput';
import TimePickerList from './timePickerList/TimePickerList';

interface TimePickerViewProps {
  selectedDate: DateTime;
  selectTime: any;
  width: number;
  timezone: string;
}
const TimePickerView = (props: TimePickerViewProps) => {
  const { selectedDate, selectTime, timezone } = props;

  const preventDefault = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={'TimePicker__wrapper'}
      id={'time-picker'}
      // style={containerStyle}
      onClick={preventDefault}
    >
      <TimeInput
        selectedDate={selectedDate}
        selectDate={selectTime}
        timezone={timezone}
      />
      <TimePickerList
        selectedDate={selectedDate}
        selectTime={selectTime}
        timezone={timezone}
      />
    </div>
  );
};

interface TimePickerProps {
  selectedDate: DateTime;
  selectTime: any;
  width?: number;
  timezone: string;
}
const TimePicker = (props: TimePickerProps) => {
  const { width, selectedDate, selectTime, timezone } = props;

  const widthFromHook: number = useWidth();

  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const handleTimeSelect = (timeDate: DateTime) => {
    selectTime(timeDate.toString());
  };

  return (
    <TimePickerView
      width={width && !isMobile ? width : widthFromHook}
      selectedDate={selectedDate}
      selectTime={handleTimeSelect}
      timezone={timezone}
    />
  );
};

export default TimePicker;
