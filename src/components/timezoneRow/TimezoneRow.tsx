import { Context } from 'context/store';
import { EvaIcons } from 'components/eva-icons';
import { parseCssDark, parseTimezoneText } from '../../utils/common';
import ButtonBase from '../button/buttonBase/ButtonBase';
import React, { useContext } from 'react';

interface TimezoneRowProps {
  timezone: string;
  openTimezoneModal: any;
}
const TimezoneRow = (props: TimezoneRowProps) => {
  const { timezone, openTimezoneModal } = props;

  const [store] = useContext(Context);
  const { isDark } = store;

  return (
    <ButtonBase
      isDark={isDark}
      className={'event_detail__row'}
      onClick={openTimezoneModal}
    >
      <div className={'event_detail__container--icon'}>
        <EvaIcons.Globe className={'svg-icon event-content-svg'} />
      </div>
      <p className={parseCssDark('event_detail__input', isDark)}>
        {parseTimezoneText(timezone)}
      </p>
    </ButtonBase>
  );
};

export default TimezoneRow;
