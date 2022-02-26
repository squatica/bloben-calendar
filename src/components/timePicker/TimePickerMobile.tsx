import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';
import React, { useContext, useEffect } from 'react';

import './TimePickerMobile.scss';
import { Context } from '../../context/store';
import { parseCssDark } from '../../utils/common';
import { parseToDateTime } from 'utils/datetimeParser';
import { useWidth } from '../../utils/layout';
import ButtonBase from '../button/buttonBase/ButtonBase';

const getHoursComponent = (
  selectedDate: any,
  selectHour: any,
  isDark: boolean
) => {
  const hours: string[] = [];
  for (let i = 0; i < 24; i++) {
    hours.push(String(i));
  }

  return hours.map((hour: string) => (
    <ButtonBase
      key={hour}
      onClick={() => selectHour(hour)}
      id={`hour_${hour}`}
      isDark={isDark}
      className={parseCssDark(
        `time-picker__text${
          Number(hour) === DateTime.fromISO(selectedDate).hour
            ? '--selected'
            : ''
        }`,
        isDark
      )}
    >
      {hour}
    </ButtonBase>
  ));
};

const EmptyButton = () => (
  <ButtonBase
    isDark={false}
    disabled={true}
    className={'time-picker__text--hidden'}
  >
    00
  </ButtonBase>
);

const getMinutesComponent = (
  selectedDate: any,
  selectMinute: any,
  isDark: boolean
) => {
  const minutes: string[] = [];
  for (let i = 0; i < 60; i = i + 1) {
    minutes.push(String(i));
  }
  return minutes.map((minute: string) => (
    <ButtonBase
      key={minute}
      isDark={isDark}
      id={`minute_${minute}`}
      onClick={() => selectMinute(minute)}
      className={parseCssDark(
        `time-picker__text${
          Number(minute) === DateTime.fromISO(selectedDate).minute
            ? '--selected'
            : ''
        }`,
        isDark
      )}
    >
      {minute}
    </ButtonBase>
  ));
};

interface TimePickerViewProps {
  selectedDate: any;
  selectMinute: any;
  selectHour: any;
  width: number;
  timezone: string;
}
const TimePickerView = (props: TimePickerViewProps) => {
  const { selectedDate, selectMinute, selectHour, width, timezone } = props;

  const [store] = useContext(Context);

  const { isMobile, isDark } = store;

  const scrollOffset: number = isMobile ? 34 : 140;

  //TODO Chrome bug for scroll into view, using only scroll to now

  const hours = getHoursComponent(selectedDate, selectHour, isDark);
  const minutes = getMinutesComponent(selectedDate, selectMinute, isDark);

  useEffect(() => {
    const hourNum: number = parseToDateTime(selectedDate, timezone).hour;
    const hourEl: any = document.getElementById(`hour_${hourNum}`);
    const hourElement: any = document.querySelector(
      '.time-picker__container-hour'
    );
    hourElement.scrollTo({
      top: (hourNum + 2) * hourEl.clientHeight - scrollOffset,
      behavior: 'smooth',
      block: 'center',
    });
  }, []);
  useEffect(() => {
    const minuteNum: number = parseToDateTime(selectedDate, timezone).hour;
    const minuteEl: any = document.getElementById(`minute_${minuteNum}`);
    const minuteElement: any = document.querySelector(
      '.time-picker__container-minute'
    );
    minuteElement.scrollTo({
      top: (minuteNum + 2) * minuteEl.clientHeight - scrollOffset,
      behavior: 'smooth',
      block: 'center',
    });
  }, []);

  const preventDefault = (e: any): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const containerStyle: any = {
    width,
  };

  return isMobile ? (
    <div
      className={'time-picker__wrapper'}
      id={'time-picker'}
      style={containerStyle}
      onClick={preventDefault}
    >
      <div className={'time-picker__container-hour'}>
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
        {hours}
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
      </div>
      <div className={parseCssDark('time-picker__separator', isDark)}>
        {':'}
      </div>
      <div className={'time-picker__container-minute'}>
        <EmptyButton />
        <EmptyButton />
        <EmptyButton />
        {minutes} <EmptyButton />
        <EmptyButton />
        <EmptyButton />
      </div>
    </div>
  ) : (
    <div
      className={'time-picker__wrapper'}
      id={'time-picker'}
      style={containerStyle}
      onClick={preventDefault}
    >
      <div className={'time-picker__container-hour'}>{hours}</div>
      <div className={'time-picker__container-minute'}>
        {minutes} <EmptyButton />
      </div>
    </div>
  );
};

interface TimePickerMobileProps {
  selectedDate: any;
  selectTime: any;
  width?: number;
  timezone: string;
}
const TimePickerMobile = (props: TimePickerMobileProps) => {
  const { width, selectedDate, selectTime, timezone } = props;

  const widthFromHook: number = useWidth();

  const isMobile: boolean = useSelector((state: any) => state.isMobile);

  const selectHour = (hour: any) => {
    const dateValue: any = parseToDateTime(selectedDate, timezone);
    const newDate: any = dateValue.set({ hour });
    selectTime(newDate);
  };
  const selectMinute = (minute: any) => {
    const dateValue: any = selectedDate
      ? DateTime.fromISO(selectedDate)
      : DateTime.local();

    const newDate: any = dateValue.set({ minute });

    selectTime(newDate);
  };

  return (
    <TimePickerView
      width={width && !isMobile ? width : widthFromHook}
      selectedDate={selectedDate}
      selectHour={selectHour}
      selectMinute={selectMinute}
      timezone={timezone}
    />
  );
};

export default TimePickerMobile;
