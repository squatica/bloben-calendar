import React, { useEffect, useRef, useState } from 'react';

import './TimeInput.scss';

import { DateTime } from 'luxon';
import { Input } from '@chakra-ui/react';
import { validateHour, validateMinute } from './TimeInputUtils';

const TIME_MAX_LENGTH = 2;
const MINUTE = 'minute';
const HOUR = 'hour';

interface TimeValues {
  hour: string;
  minute: string;
}
const getTimeValues = (date: string): TimeValues => {
  const dateTime: DateTime = DateTime.fromISO(date);

  return {
    hour: String(dateTime.hour),
    minute: String(dateTime.minute),
  };
};

interface TimeInputProps {
  selectedDate: string;
  selectDate: any;
}
const TimeInput = (props: TimeInputProps) => {
  const { selectedDate, selectDate } = props;

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
    let newDate: DateTime = DateTime.fromISO(selectedDate);

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
    const timeValues: TimeValues = getTimeValues(selectedDate);
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
      <Input
        ref={hourRef}
        value={hour}
        maxLength={TIME_MAX_LENGTH}
        name={HOUR}
        className={'TimeInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        width={20}
      />
      <div className={'TimeInput__container-text'}>
        <p className={'TimeInput__text'}>:</p>
      </div>
      <Input
        ref={minuteRef}
        value={minute}
        maxLength={TIME_MAX_LENGTH}
        name={MINUTE}
        className={'TimeInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        width={20}
      />
    </div>
  );
};

export default TimeInput;
