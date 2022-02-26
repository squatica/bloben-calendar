import React from 'react';

import './Logo.scss';

import { parseCssDark } from '../../utils/common';
import LogoIcon from '../logoIcon/LogoIcon';

interface LogoProps {
  imageClassName?: string;
  textClassName?: string;
  isDark: boolean;
}
const Logo = (props: LogoProps) => {
  const { imageClassName, textClassName, isDark } = props;

  const logoTextClassName: string = !textClassName
    ? 'Logo__text'
    : textClassName;
  const logoImageClassName: string = !imageClassName
    ? 'Logo__image'
    : imageClassName;

  return (
    <div className={'Logo__container'}>
      <LogoIcon className={parseCssDark(logoImageClassName, isDark)} />
      <h3 className={parseCssDark(logoTextClassName, isDark)}>Bloben</h3>
    </div>
  );
};

export default Logo;
