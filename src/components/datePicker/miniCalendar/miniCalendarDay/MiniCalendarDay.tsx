import React, { useContext } from 'react';

import './MiniCalendarDay.scss';

import { Context } from '../../../../context/store';
import { parseCssDark } from '../../../../utils/common';
import ButtonBase from '../../../button/buttonBase/ButtonBase';
import LuxonHelper from 'utils/LuxonHelper';

interface MiniCalendarDayProps {
  item: any;
  width: number;
  sideMargin: number;
  selectDate: any;
  selectedDate: string;
  monthDayRef: any;
}
const MiniCalendarDay = (props: MiniCalendarDayProps) => {
  const { item, width, sideMargin, selectDate, selectedDate, monthDayRef } =
    props;

  const oneSide: number = (width - sideMargin - sideMargin) / 7;

  const oneDayStyle: any = {
    width: `${oneSide}px`,
    height: `${oneSide}px`,
    borderRadius: `${oneSide / 2}px`,
  };

  const isSameMonthValue: boolean = item.hasSame(monthDayRef, 'month');
  const isSelectedDate: boolean = LuxonHelper.isSameDay(item, selectedDate);

  const [store] = useContext(Context);

  const { isDark } = store;

  const onClick = (): void => {
    selectDate(item);
  };

  const buttonClassName: string = parseCssDark(
    `MiniCalendarDay__button${isSelectedDate ? '-selected' : ''}`,
    isDark
  );

  const textClassName: string = parseCssDark(
    `MiniCalendarDay__text${isSameMonthValue ? '-normal' : ''}${
      isSelectedDate ? '-selected' : ''
    }`,
    isDark
  );

  return (
    <ButtonBase
      isDark={isDark}
      onClick={onClick}
      className={buttonClassName}
      style={oneDayStyle}
    >
      <p className={textClassName}>{item.day}</p>
    </ButtonBase>
  );
};

export default MiniCalendarDay;
