import './ButtonBase.scss';
import { Button } from '@chakra-ui/react';
import { ButtonProps } from '@chakra-ui/button/dist/declarations/src/button';
import { useEffect, useState } from 'react';

interface ButtonBaseProps extends ButtonProps {
  hoverStyleCustom?: any;
  pressAnimate?: boolean;
}
const ButtonBase = (props: ButtonBaseProps) => {
  const { hoverStyleCustom, pressAnimate } = props;

  const [className, setClassName] = useState('');

  const onPress = () => {
    if (!pressAnimate) {
      return;
    }
    setClassName('ButtonBase-down');
  };

  const onLeave = () => {
    if (!pressAnimate) {
      return;
    }
    setClassName('ButtonBase-up');
  };

  useEffect(() => {
    if (!pressAnimate) {
      return;
    }
    window.addEventListener('mouseup', onLeave);

    return () => window.removeEventListener('mouseUp', onLeave);
  }, []);

  const hoverStyle = hoverStyleCustom || {
    background: 'gray.700',
  };

  return (
    <Button
      _focus={{ boxShadow: 'none' }}
      onClick={props.onClick}
      bg={props.bg || 'gray.800'}
      color={props.color || 'gray.100'}
      size={props.size || 'lg'}
      _hover={hoverStyle}
      _active={hoverStyle}
      className={className}
      onMouseDownCapture={onPress}
      onTouchStart={onPress}
      onMouseUp={onLeave}
      onTouchEnd={onLeave}
      onMouseUpCapture={onLeave}
      isLoading={props.isLoading}
    >
      {props.children}
    </Button>
  );
};

export default ButtonBase;
