import './SettingsRow.scss';
import React from 'react';

interface SettingsRowProps {
  title: string;
  children: any;
}
const SettingsRow = (props: SettingsRowProps) => {
  return (
    <div className={'SettingsRow__container'}>
      <div className={'SettingsRow__child'}>
        <p className={'SettingsRow__title'}>{props.title}</p>
      </div>
      <div className={'SettingsRow__child'}>{props.children}</div>
    </div>
  );
};

export default SettingsRow;
