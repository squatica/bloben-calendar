import './LogoName.scss';
import LogoDark from '../../assets/logo_dark.svg';
import LogoLight from '../../assets/logo_light.svg';
import React from 'react';

interface LogoNameProps {
  isDark: boolean;
}
const LogoName = (props: LogoNameProps) => {
  const { isDark } = props;

  return (
    <div className={'LogoName__row'}>
      <div className={'LogoName__icon'}>
        <img src={!isDark ? LogoDark : LogoLight} className={'Logo__image'} />
      </div>
    </div>
  );
};

export default LogoName;
