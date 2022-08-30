import React, { useState } from 'react';

import './ButtonIcon.scss';
import { parseCssDark } from '../../../utils/common';

type ButtonIconSize = 'small' | 'normal' | 'big' | 'full';

interface ButtonIconProps {
  children: any;
  onClick?: any;
  isDark: boolean;
  size?: ButtonIconSize;
  iconSize?: ButtonIconSize;
  disabled?: boolean;
  backdropClassName?: string;
  noActive?: boolean;
  style?: any;
}
const ButtonIcon = (props: ButtonIconProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const {
    children,
    onClick,
    size,
    disabled,
    isDark,
    iconSize,
    noActive,
    backdropClassName,
    style,
  } = props;

  const handleTouchStart = (): void => setIsPressed(true);

  const handleTouchOff = (): void => setIsPressed(false);

  const containerClassName: string = !size
    ? 'ButtonIcon__container'
    : `ButtonIcon__container-${size}`;

  const backdropClassNameString: string = backdropClassName
    ? backdropClassName
    : 'ButtonIcon__backdrop';

  const buttonClassName: string = noActive
    ? `${disabled ? 'ButtonIcon__disabled ' : ''}ButtonIcon-inactive`
    : `${disabled ? 'ButtonIcon__disabled ' : ''}ButtonIcon`;

  const IconElement: any = React.cloneElement(children, {
    className: `ButtonIcon__svg${iconSize ? `-${iconSize}` : '-normal'}`,
  });

  return (
    <div className={containerClassName} style={style}>
      <button
        className={parseCssDark(buttonClassName, isDark)}
        onClick={onClick}
        disabled={disabled}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchOff}
      >
        {IconElement}
        {isPressed ? <div className={backdropClassNameString} /> : null}
      </button>
    </div>
  );
};

export default ButtonIcon;
