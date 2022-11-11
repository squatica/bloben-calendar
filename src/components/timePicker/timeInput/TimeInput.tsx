import React, { useEffect, useRef, useState } from 'react';

import './TimeInput.scss';

import { ChakraInput } from 'bloben-components';
import { DateTime } from 'luxon';
import { validateHour, validateMinute } from './TimeInputUtils';

const TIME_MAX_LENGTH = 2;
const MINUTE = 'minute';
const HOUR = 'hour';

interface TimeValues {
  hour: string;
  minute: string;
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getTimeValues = (date: DateTime, timezone: string): TimeValues => {
  const dateTime = date;

  // if (timezone !== FLOATING_DATETIME) {
  //   dateTime.setZone(timezone);
  // } else {
  //   dateTime = date.setZone(UTC_TIMEZONE);
  // }

  return {
    hour: String(dateTime.hour),
    minute: String(dateTime.minute),
  };
};

interface TimeInputProps {
  selectedDate: DateTime;
  selectDate: any;
  timezone: string;
}
const TimeInput = (props: TimeInputProps) => {
  const { selectedDate, selectDate, timezone } = props;

  const minuteRef: any = useRef(null);
  const hourRef: any = useRef(null);

  const [minute, setMinute]: any = useState('');
  const [hour, setHour]: any = useState('');

  const formatTime = (name: string, value: string) => {
    const withZero: boolean = Number(value) < 10;
    let result = '';
    if (withZero) {
      result += '0';
    }

    result += value;

    if (name === HOUR) {
      setHour(result);
    }

    if (name === MINUTE) {
      setMinute(result);
    }
  };

  const onChangeInput = (e: any): void => {
    const { name, value } = e.target;

    if (isNaN(value)) {
      return;
    }

    if (name === HOUR) {
      if (validateHour(value)) {
        setHour(value);
      }
    }

    if (name === MINUTE) {
      if (validateMinute(value)) {
        setMinute(value);
      }
    }
  };

  const onBlur = () => {
    let newDate = selectedDate;
    //
    // if (timezone !== FLOATING_DATETIME) {
    //   newDate.setZone(timezone);
    // } else {
    //   newDate = DateTime.fromISO(selectedDate, { zone: UTC_TIMEZONE });
    // }

    newDate = newDate.set({ hour, minute });

    if (newDate.isValid) {
      selectDate(newDate);
    }
  };

  const onFocus = (e: any) => {
    e.target.select();
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      const { name } = e.target;
      e.preventDefault();

      if (name === HOUR) {
        formatTime(HOUR, hour);
        minuteRef.current.focus();
      }

      if (name === MINUTE) {
        formatTime(MINUTE, minute);
        onBlur();
      }
    } else {
      // onChangeInput({target: e.nativeEvent.target})
    }
  };

  const setTimeValues = (): void => {
    const timeValues: TimeValues = getTimeValues(selectedDate, timezone);
    formatTime(HOUR, timeValues.hour);
    formatTime(MINUTE, timeValues.minute);
  };

  useEffect(() => {
    setTimeout(() => {
      hourRef?.current?.select();
    }, 50);

    setTimeValues();
  }, []);

  useEffect(() => {
    setTimeValues();
  }, [selectedDate]);

  return (
    <div className={'TimeInput__container'}>
      <ChakraInput
        ref={hourRef}
        value={hour}
        maxLength={TIME_MAX_LENGTH}
        name={HOUR}
        className={'TimeInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        width={16}
      />
      <div className={'TimeInput__container-text'}>
        <p className={'TimeInput__text'}>:</p>
      </div>
      <ChakraInput
        ref={minuteRef}
        value={minute}
        maxLength={TIME_MAX_LENGTH}
        name={MINUTE}
        className={'TimeInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        width={16}
      />
    </div>
  );
};

export default TimeInput;
