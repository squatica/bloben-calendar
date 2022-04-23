import { ButtonProps } from '@chakra-ui/button/dist/declarations/src/button';
import ButtonBase from '../buttonBase/ButtonBase';

interface PrimaryButtonProps extends ButtonProps {
  isSecondary?: boolean;
}
const PrimaryButton = (props: PrimaryButtonProps) => {
  const hoverStyle = {
    background: props.isSecondary ? 'gray.600' : 'pink.400',
  };

  return (
    <ButtonBase
      onClick={props.onClick}
      bg={props.isSecondary ? 'gray.800' : 'primary.400'}
      color={'whiteAlpha.900'}
      size={props.size || 'lg'}
      hoverStyleCustom={hoverStyle}
      pressAnimate={true}
      isLoading={props.isLoading}
    >
      {props.children}
    </ButtonBase>
  );
};

export default PrimaryButton;
