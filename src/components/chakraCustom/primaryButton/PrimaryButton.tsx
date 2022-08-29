import { ButtonProps } from '@chakra-ui/react';
import { Context } from '../../../context/store';
import ButtonBase from '../buttonBase/ButtonBase';
import React, { useContext } from 'react';

interface PrimaryButtonProps extends ButtonProps {
  isSecondary?: boolean;
}

const getColors = (
  isSecondary: boolean | undefined,
  isDark: boolean
): { bg: string; color: string } => {
  if (!isSecondary) {
    if (!isDark) {
      return {
        bg: 'pink.500',
        color: 'gray.100',
      };
    } else {
      return { bg: 'pink.300', color: 'gray.900' };
    }
  } else {
    if (!isDark) {
      return { bg: 'gray.900', color: 'gray.100' };
    } else {
      return { bg: 'gray.400', color: 'gray.900' };
    }
  }
};

const getHoverStyle = (isSecondary: boolean | undefined, isDark: boolean) => {
  if (!isSecondary) {
    if (!isDark) {
      return {
        bg: 'pink.400',
        color: 'gray.100',
      };
    } else {
      return { bg: 'pink.200', color: 'gray.900' };
    }
  } else {
    if (!isDark) {
      return { bg: 'gray.800', color: 'gray.100' };
    } else {
      return { bg: 'gray.300', color: 'gray.900' };
    }
  }
};

const PrimaryButton = (props: PrimaryButtonProps) => {
  const [store] = useContext(Context);
  const { isDark } = store;

  const hoverColors = getHoverStyle(props.isSecondary, isDark);
  const hoverStyle = {
    background: hoverColors.bg,
    color: hoverColors.color,
  };

  const colors = getColors(props.isSecondary, isDark);
  return (
    <ButtonBase
      onClick={props.onClick}
      bg={colors.bg}
      color={colors.color}
      size={props.size || 'lg'}
      hoverStyleCustom={hoverStyle}
      pressAnimate={true}
      isLoading={props.isLoading}
      disabled={props.disabled}
    >
      {props.children}
    </ButtonBase>
  );
};

export default PrimaryButton;
