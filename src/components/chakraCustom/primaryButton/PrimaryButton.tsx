import { ButtonProps } from '@chakra-ui/button/dist/declarations/src/button';
import ButtonBase from '../buttonBase/ButtonBase';

type PrimaryButtonProps = ButtonProps;
const PrimaryButton = (props: PrimaryButtonProps) => {
  const hoverStyle = {
    background: 'pink.400',
  };

  return (
    <ButtonBase
      onClick={props.onClick}
      bg={'primary.400'}
      color={'gray.100'}
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
