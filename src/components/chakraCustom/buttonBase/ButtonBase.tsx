import './ButtonBase.scss';
import { Button } from '@chakra-ui/react';
import { ButtonProps } from '@chakra-ui/button/dist/declarations/src/button';
import { useState } from 'react';

interface ButtonBaseProps extends ButtonProps {
  hoverStyleCustom?: any;
  pressAnimate?: boolean;
}
const ButtonBase = (props: ButtonBaseProps) => {
  // const [store] = useContext(Context);
  // const { isDark } = store;

  const { hoverStyleCustom, pressAnimate } = props;

  const [className, setClassName] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  const onPress = () => {
    if (!pressAnimate) {
      return;
    }
    setIsPressed(true);
    setClassName('ButtonBase-down');
  };

  const onLeave = () => {
    if (!pressAnimate || !isPressed) {
      return;
    }
    setIsPressed(false);
    setClassName('ButtonBase-up');
  };

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
      variant={props.variant || 'solid'}
      _hover={hoverStyle}
      _active={hoverStyle}
      className={className}
      onMouseDownCapture={onPress}
      onTouchStart={onPress}
      onMouseUp={onLeave}
      onMouseOutCapture={onLeave}
      onTouchEnd={onLeave}
      onMouseUpCapture={onLeave}
      isLoading={props.isLoading}
      onMouseDown={onPress}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
};

export default ButtonBase;
