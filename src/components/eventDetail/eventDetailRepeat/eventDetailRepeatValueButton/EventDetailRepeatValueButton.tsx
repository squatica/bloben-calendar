import { Context, StoreContext } from '../../../../context/store';
import { parseCssDark } from '../../../../utils/common';
import ButtonBase from '../../../button/buttonBase/ButtonBase';
import React, { useContext } from 'react';

interface RepeatValueButtonProps {
  label: string;
  handleClick: any;
  value: any;
  style: any;
}
const EventDetailRepeatValueButton = (props: RepeatValueButtonProps) => {
  const { label, handleClick, value, style } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark } = store;

  return (
    <div className={'repeat__value-wrapper'}>
      <p className={parseCssDark('repeat__value-label', isDark)}>{label}</p>
      <ButtonBase
        isDark={isDark}
        className={'repeat__value-container'}
        style={style}
        onClick={handleClick}
      >
        <p className={parseCssDark('repeat__value-text', isDark)}>{value}</p>
      </ButtonBase>
    </div>
  );
};

export default EventDetailRepeatValueButton;
