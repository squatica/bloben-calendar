import './SettingsRow.scss';
import { Context, StoreContext } from '../../../context/store';
import { parseCssDark } from '../../../utils/common';
import React, { useContext } from 'react';

interface SettingsRowProps {
  title: string;
  children: any;
}
const SettingsRow = (props: SettingsRowProps) => {
  const [store]: [StoreContext] = useContext(Context);

  return (
    <div className={'SettingsRow__container'}>
      <div className={'SettingsRow__child'}>
        <p className={parseCssDark('SettingsRow__title', store.isDark)}>
          {props.title}
        </p>
      </div>
      <div className={'SettingsRow__child'}>{props.children}</div>
    </div>
  );
};

export default SettingsRow;
