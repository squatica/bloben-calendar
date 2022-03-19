import React, { useContext, useEffect, useRef, useState } from 'react';

import './DateInput.scss';

import { Context } from '../../../context/store';
import { DateTime } from 'luxon';
import { Input } from '@chakra-ui/react';
import {
  validateDate,
  validateDay,
  validateMonth,
  validateYear,
} from './DateInputUtils';

const DAY_MAX_LENGTH = 2;
const MONTH_MAX_LENGTH = 2;
const YEAR_MAX_LENGTH = 4;
const DAY = 'day';
const MONTH = 'month';
const YEAR = 'year';

interface DateValues {
  day: string;
  month: string;
  year: string;
}
const getDateValues = (date: string): DateValues => {
  const dateTime: DateTime = DateTime.fromISO(date);

  return {
    day: String(dateTime.day),
    month: String(dateTime.month),
    year: String(dateTime.year),
  };
};

interface DateInputProps {
  selectedDate: string;
  selectDate: any;
  initDatesPicker: any;
  sideMargin: number;
  width: number;
}
const DateInput = (props: DateInputProps) => {
  const { selectedDate, selectDate, initDatesPicker, sideMargin, width } =
    props;

  const [store] = useContext(Context);
  const { isMobile } = store;

  const dayRef: any = useRef(null);
  const monthRef: any = useRef(null);
  const yearRef: any = useRef(null);

  const [day, setDay]: any = useState('');
  const [month, setMonth]: any = useState('');
  const [year, setYear]: any = useState('');

  const onChangeInput = (e: any): void => {
    const { name, value } = e.target;

    if (isNaN(value)) {
      return;
    }

    if (name === DAY) {
      if (validateDay(value)) {
        setDay(value);
      }
    }

    if (name === MONTH) {
      if (validateMonth(value)) {
        setMonth(value);
      }
    }

    if (name === YEAR) {
      if (validateYear(value)) {
        setYear(value);
      }
    }
  };

  const setDateValues = (): void => {
    const dateValues: DateValues = getDateValues(selectedDate);
    setDay(dateValues.day);
    setMonth(dateValues.month);
    setYear(dateValues.year);
  };

  const onBlur = () => {
    if (!validateDate(day, month, year)) {
      setDateValues();
      return;
    }

    let newDate: DateTime = DateTime.fromISO(selectedDate);

    newDate = newDate.set({ day, month, year });

    if (newDate.isValid) {
      selectDate(newDate);
      initDatesPicker(newDate);
    }
  };

  const onFocus = (e: any) => {
    e.target.select();
  };

  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      const { name } = e.target;
      e.preventDefault();

      if (name === DAY) {
        monthRef.current.focus();
      }

      if (name === MONTH) {
        yearRef.current.focus();
      }

      if (name === YEAR) {
        onBlur();
      }
    } else {
      // onChangeInput({target: e.nativeEvent.target})
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        if (dayRef.current) {
          dayRef.current.select();
        }
      }, 50);
    }

    setDateValues();
  }, []);

  useEffect(() => {
    setDateValues();
  }, [selectedDate]);

  const containerStyle: any = {
    width: width - sideMargin * 2,
    marginLeft: sideMargin,
    marginRight: sideMargin,
  };

  return (
    <div className={'DateInput__container'} style={containerStyle}>
      <Input
        ref={dayRef}
        value={day}
        maxLength={DAY_MAX_LENGTH}
        name={DAY}
        className={'DateInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        disabled={isMobile}
        width={20}
        padding={0}
      />
      <div className={'DateInput__container-text'}>
        <p className={'DateInput__text'}>/</p>
      </div>
      <Input
        ref={monthRef}
        value={month}
        maxLength={MONTH_MAX_LENGTH}
        name={MONTH}
        className={'DateInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        disabled={isMobile}
        width={20}
        padding={0}
        margin={0}
      />
      <div className={'DateInput__container-text'}>
        <p className={'DateInput__text'}>/</p>
      </div>
      <Input
        ref={yearRef}
        value={year}
        maxLength={YEAR_MAX_LENGTH}
        name={YEAR}
        className={'DateInput'}
        onChange={onChangeInput}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyPress={onKeyPress}
        disabled={isMobile}
        width={52}
        padding={0}
      />
    </div>
  );
};

export default DateInput;
