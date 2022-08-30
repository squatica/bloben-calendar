import './Button.scss';
import React from 'react';

import { parseCssDark } from '../../utils/common';
import ButtonBase from './buttonBase/ButtonBase';

type ButtonType =
  | 'primary'
  | 'primaryLong'
  | 'normal'
  | 'normalLong'
  | 'transparent'
  | 'transparentLong';

export const PRIMARY_BUTTON = 'primary';
export const PRIMARY_LONG_BUTTON = 'primaryLong';
export const NORMAL_BUTTON = 'normal';
export const NORMAL_LONG_BUTTON = 'normalLong';
export const TRANSPARENT_BUTTON = 'transparent';
export const TRANSPARENT_LONG_BUTTON = 'transparentLong';

const PRIMARY_CLASS_NAME = 'ButtonBase-primary';
const PRIMARY_LONG_CLASS_NAME = 'Button-long ButtonBase-primary';
const NORMAL_CLASS_NAME = 'ButtonBase-normal';
const NORMAL_LONG_CLASS_NAME = 'Button-long ButtonBase-normal';
const TRANSPARENT_CLASS_NAME = 'ButtonBase-transparent';
const TRANSPARENT_LONG_CLASS_NAME = 'Button-long ButtonBase-transparent';

const getButtonClass = (
  type: ButtonType | undefined,
  disabled?: boolean
): string => {
  let buttonClassName: string;

  switch (type) {
    case PRIMARY_BUTTON:
      buttonClassName = PRIMARY_CLASS_NAME;
      break;
    case PRIMARY_LONG_BUTTON:
      buttonClassName = PRIMARY_LONG_CLASS_NAME;
      break;
    case NORMAL_BUTTON:
      buttonClassName = NORMAL_CLASS_NAME;
      break;
    case NORMAL_LONG_BUTTON:
      buttonClassName = NORMAL_LONG_CLASS_NAME;
      break;
    case TRANSPARENT_BUTTON:
      buttonClassName = TRANSPARENT_CLASS_NAME;
      break;
    case TRANSPARENT_LONG_BUTTON:
      buttonClassName = TRANSPARENT_LONG_CLASS_NAME;
      break;
    default:
      buttonClassName = NORMAL_CLASS_NAME;
      break;
  }

  if (disabled) {
    return `${buttonClassName} ButtonBase-disabled`;
  }

  return buttonClassName;
};

interface ButtonProps {
  isDark: boolean;
  text?: string;
  onClick: any;
  type?: ButtonType;
  isLoading?: boolean;
  disabled?: boolean;
  children?: any;
  style?: any;
  onClickFromParent?: any;
}
const Button = (props: ButtonProps) => {
  const {
    text,
    style,
    children,
    onClick,
    type,
    isDark,
    isLoading,
    disabled,
    onClickFromParent,
  } = props;

  const isLongButton: boolean = type?.indexOf('Long') !== -1;
  const buttonClassName: string = getButtonClass(type, disabled);

  return (
    <div
      className={`Button__wrapper${isLongButton ? '-long' : ''}`}
      style={style}
    >
      <ButtonBase
        className={parseCssDark(buttonClassName, isDark)}
        onClick={onClick}
        disabled={disabled}
        isDark={isDark}
        text={text}
        isLoading={isLoading}
        onClickFromParent={onClickFromParent}
      >
        {children}
      </ButtonBase>
    </div>
  );
};

export default Button;
