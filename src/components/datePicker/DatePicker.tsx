import React, { useEffect, useState } from 'react';

import './DatePicker.scss';

import { AppSettings, ReduxState } from '../../types/interface';
import { DateTime } from 'luxon';
import { calculateMonthDays } from '../../utils/dates';
import { useSelector } from 'react-redux';
import { useWidth } from '../../utils/layout';
import DateInput from './dateInput/DateInput';
import MiniCalendar from './miniCalendar/MiniCalendar';

const REF_DATE_MONTH = 14;

interface DatePickerViewProps {
  keyPrefix?: string;
  data: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: string | null;
  selectedDatePicker: string;
  initDatesPicker: any;
  addMonth: any;
  subMonth: any;
  handleScroll: any;
  withInput?: boolean;
  selectedDates?: string[];
}
const DatePickerView = (props: DatePickerViewProps) => {
  const {
    width,
    sideMargin,
    handleScroll,
    data,
    selectDate,
    selectedDate,
    selectedDatePicker,
    initDatesPicker,
    addMonth,
    subMonth,
    keyPrefix,
    withInput,
    selectedDates,
  } = props;

  return (
    <div
      className={'DatePicker__wrapper'}
      id={'date-picker'}
      onScroll={handleScroll}
    >
      {withInput ? (
        <DateInput
          selectedDate={selectedDate || DateTime.now().toString()}
          selectDate={selectDate}
          initDatesPicker={initDatesPicker}
          sideMargin={sideMargin}
          width={width}
        />
      ) : null}
      <MiniCalendar
        data={data}
        width={width}
        sideMargin={sideMargin}
        selectDate={selectDate}
        selectedDate={selectedDate}
        selectedDatePicker={selectedDatePicker}
        keyPrefix={keyPrefix}
        addMonth={addMonth}
        subMonth={subMonth}
        selectedDates={selectedDates}
      />
    </div>
  );
};

interface DatePickerProps {
  keyPrefix?: string;
  data?: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: string | null;
  handleScroll?: any;
  height?: number;
  withInput?: boolean;
  selectedDates?: string[];
}
const DatePicker = (props: DatePickerProps) => {
  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );

  const {
    selectDate,
    withInput,
    selectedDate,
    width,
    sideMargin,
    keyPrefix,
    selectedDates,
  } = props;
  const widthFromHook: number = useWidth();

  const [selectedDatePicker, setSelectedDatePicker]: any = useState(null);
  const [months, setMonths]: any = useState([]);

  const getDaysInMonthInit = (date: DateTime) => {
    const initMonths: DateTime[] = calculateMonthDays(
      date,
      settings.startOfWeek
    );

    setMonths(initMonths);
  };

  const addOneMonth = () => {
    const newMonth: DateTime[] = calculateMonthDays(
      months[REF_DATE_MONTH].plus({ months: 1 }),
      settings.startOfWeek
    );
    setSelectedDatePicker(newMonth[REF_DATE_MONTH]);
    setMonths(newMonth);
  };
  const subOneMonth = () => {
    const newMonth: DateTime[] = calculateMonthDays(
      months[REF_DATE_MONTH].minus({ months: 1 }),
      settings.startOfWeek
    );
    setSelectedDatePicker(newMonth[REF_DATE_MONTH]);
    setMonths(newMonth);
  };

  const initDatesPicker = (date: DateTime) => {
    const newMonth: DateTime[] = calculateMonthDays(date, settings.startOfWeek);
    setSelectedDatePicker(newMonth[REF_DATE_MONTH]);
    setMonths(newMonth);
  };

  useEffect(() => {
    if (!selectedDate) {
      const dateNow: DateTime = DateTime.local();
      getDaysInMonthInit(dateNow);
      setSelectedDatePicker(dateNow);
    } else {
      getDaysInMonthInit(DateTime.fromISO(selectedDate));
      setSelectedDatePicker(selectedDate);
    }
  }, []);

  const handleScroll = () => {
    const element: any = document.getElementById('date-picker');
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      // element is at the end of its scroll, load more content
    }
  };

  return months ? (
    <DatePickerView
      keyPrefix={keyPrefix}
      handleScroll={handleScroll}
      width={width ? width : widthFromHook}
      sideMargin={sideMargin}
      data={months}
      selectDate={selectDate}
      selectedDate={selectedDate}
      selectedDatePicker={selectedDatePicker}
      initDatesPicker={initDatesPicker}
      addMonth={addOneMonth}
      subMonth={subOneMonth}
      withInput={withInput}
      selectedDates={selectedDates}
    />
  ) : null;
};

export default DatePicker;
