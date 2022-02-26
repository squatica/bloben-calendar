import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

interface ChakraModalProps {
  isOpen?: boolean;
  handleClose: any;
  minWidth?: number;
  withCloseButton?: boolean;
  title?: string;
  children: any;
  data?: any;
  footer?: any;
  header?: any;
  className?: string;
  height?: string;
}
const ChakraModal = (props: ChakraModalProps) => {
  const {
    isOpen = true,
    handleClose,
    minWidth = 350,
    withCloseButton = true,
    title,
    children,
    data,
    footer,
    header,
    height,
    className = 'Chakra__modal-padding-24',
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered autoFocus={false}>
      <ModalOverlay />
      <ModalContent className={className} minWidth={minWidth} height={height}>
        {title ? <ModalHeader>{title}</ModalHeader> : null}
        {header ? header : null}
        {withCloseButton ? (
          <ModalCloseButton _focus={{ boxShadow: 'none' }} />
        ) : null}
        <ModalBody>{React.cloneElement(children, { data })}</ModalBody>
        {footer ? footer : null}
      </ModalContent>
    </Modal>
  );
};

export default ChakraModal;
