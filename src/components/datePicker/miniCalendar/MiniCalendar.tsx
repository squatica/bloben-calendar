import React from 'react';

import './MiniCalendar.scss';
import { Text } from '@chakra-ui/react';

import { AppSettings, ReduxState } from '../../../types/interface';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import MiniCalendarDay from './miniCalendarDay/MiniCalendarDay';
import MiniCalendarHeader from './miniCalendarHeader/MiniCalendarHeader';

const MIDDLE_DATE_REF = 14;

const renderWeekdays = (startOnMonday: boolean) => {
  const mondayStart = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const sundayStart = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return startOnMonday
    ? mondayStart.map((day) => (
        <div key={day} className={'MiniCalendarHeader-weekdays__col'}>
          <Text>{day}</Text>
        </div>
      ))
    : sundayStart.map((day) => (
        <div key={day} className={'MiniCalendarHeader-weekdays__col'}>
          <Text key={day}>{day}</Text>
        </div>
      ));
};

const renderDays = (
  data: any,
  width: number,
  sideMargin = 0,
  selectDate: any,
  selectedDate: string,
  monthDayRef: any,
  keyPrefix?: string
) =>
  data.map((item: any) => (
    <MiniCalendarDay
      key={`${keyPrefix}${item.year}-${item.month}-${item.day}-${item.millisecond}`}
      item={item}
      width={width}
      sideMargin={sideMargin}
      selectDate={selectDate}
      selectedDate={selectedDate}
      monthDayRef={monthDayRef}
    />
  ));

interface MiniCalendarProps {
  keyPrefix?: string;
  data: DateTime[];
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: string;
  selectedDatePicker: string;
  addMonth: any;
  subMonth: any;
}
const MiniCalendar = (props: MiniCalendarProps) => {
  const {
    data,
    width,
    sideMargin,
    selectDate,
    selectedDate,
    selectedDatePicker,
    keyPrefix,
    subMonth,
    addMonth,
  } = props;

  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );

  const monthDayRef: any = data[MIDDLE_DATE_REF];

  const miniCalendarDays: any = renderDays(
    data,
    width,
    sideMargin,
    selectDate,
    selectedDate,
    monthDayRef,
    keyPrefix
  );

  const containerStyle: any = {
    width: width - sideMargin * 2,
    marginLeft: sideMargin,
    marginRight: sideMargin,
  };

  return (
    <div className={'MiniCalendar__container'} style={containerStyle}>
      <MiniCalendarHeader
        selectedDate={selectedDatePicker}
        subOneMonth={subMonth}
        addOneMonth={addMonth}
      />
      <div className={'MiniCalendarHeader-weekdays__row'}>
        {renderWeekdays(settings.startOfWeek === 'Monday')}
      </div>
      {miniCalendarDays}
    </div>
  );
};

export default MiniCalendar;
