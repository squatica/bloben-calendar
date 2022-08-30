import React, { useContext, useEffect } from 'react';

import './EventDetailRepeatCustom.scss';

import { Context, StoreContext } from '../../../../context/store';
import { parseCssDark } from '../../../../utils/common';
import Button, { NORMAL_BUTTON } from '../../../../components/button/Button';

interface EventDetailRepeatCustomProps {
  rRuleState: any;
  setRRule: any;
  handleClose: any;
}
const EventDetailRepeatCustom = (props: EventDetailRepeatCustomProps) => {
  const { rRuleState, setRRule, handleClose } = props;

  const [store]: [StoreContext] = useContext(Context);

  const { isDark } = store;

  useEffect(() => {
    if (rRuleState.freq === 'none') {
      setRRule('freq', 'WEEKLY');
      setRRule('interval', 1);
    }
  }, []);

  const handleSave = (): void => {
    handleClose();
  };

  return (
    <div className={'alarm-settings-container'}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '50%', justifyContent: 'flex-end' }}>
          <h4 className={parseCssDark('repeat__subtitle', isDark)}>Repeat</h4>
        </div>
        <div
          style={{ display: 'flex', width: '50%', justifyContent: 'flex-end' }}
        >
          <Button
            isDark={isDark}
            onClick={handleSave}
            type={NORMAL_BUTTON}
            text={'Save'}
          />
        </div>
      </div>
      <div className={'repeat__row'}></div>
    </div>
  );
};

export default EventDetailRepeatCustom;
