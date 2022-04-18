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
  minWidth?: number | string;
  withCloseButton?: boolean;
  title?: string;
  children: any;
  data?: any;
  footer?: any;
  header?: any;
  className?: string;
  height?: string;
  style?: any;
  maxWidth?: number;
}
const ChakraModal = (props: ChakraModalProps) => {
  const {
    isOpen = true,
    handleClose,
    minWidth = 350,
    maxWidth,
    withCloseButton = true,
    title,
    children,
    data,
    footer,
    header,
    height,
    style,
    className = 'Chakra__modal-padding-24',
  } = props;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered autoFocus={false}>
      <ModalOverlay />
      <ModalContent
        style={style}
        className={className}
        minWidth={minWidth}
        height={height}
        maxWidth={maxWidth}
      >
        {title ? <ModalHeader>{title}</ModalHeader> : null}
        {header ? header : null}
        {withCloseButton ? (
          <ModalCloseButton _focus={{ boxShadow: 'none' }} />
        ) : null}
        <ModalBody style={{ height: 'auto' }}>
          {React.cloneElement(children, { data })}
        </ModalBody>
        {footer ? footer : null}
      </ModalContent>
    </Modal>
  );
};

export default ChakraModal;
