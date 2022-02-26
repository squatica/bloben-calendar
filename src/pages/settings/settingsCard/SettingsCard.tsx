import './SettingsCard.scss';
import React from 'react';

interface SettingsCardProps {
  title: string;
  children: any;
}
const SettingsCard = (props: SettingsCardProps) => {
  return (
    <div className={'SettingsCard__container'}>
      <h6 className={'SettingsCard__title'}>{props.title}</h6>
      {props.children}
    </div>
  );
};

export default SettingsCard;
