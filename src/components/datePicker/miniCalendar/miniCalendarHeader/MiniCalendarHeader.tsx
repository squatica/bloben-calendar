import React, { useContext } from 'react';

import './MiniCalendarHeader.scss';

import { Context, StoreContext } from '../../../../context/store';
import { DateTime } from 'luxon';
import { EvaIcons } from 'bloben-components';
import { parseCssDark } from '../../../../utils/common';
import ButtonIcon from '../../../button/buttonIcon/ButtonIcon';

interface MiniCalendarHeaderProps {
  selectedDate: string;
  subOneMonth: any;
  addOneMonth: any;
}
const MiniCalendarHeader = (props: MiniCalendarHeaderProps) => {
  const { selectedDate, subOneMonth, addOneMonth } = props;

  const [store]: [StoreContext] = useContext(Context);

  const { isDark } = store;

  const miniCalendarTitle: string =
    DateTime.fromISO(selectedDate).toFormat('MMMM yyyy');

  return (
    <div className={'MiniCalendarHeader__row'}>
      <h6 className={parseCssDark('MiniCalendarHeader__title', isDark)}>
        {miniCalendarTitle}
      </h6>
      <ButtonIcon isDark={isDark} onClick={subOneMonth} size={'small'}>
        <EvaIcons.ChevronLeft className={parseCssDark('icon-svg', isDark)} />
      </ButtonIcon>
      <ButtonIcon isDark={isDark} onClick={addOneMonth} size={'small'}>
        <EvaIcons.ChevronRight className={parseCssDark('icon-svg', isDark)} />
      </ButtonIcon>
    </div>
  );
};

export default MiniCalendarHeader;
