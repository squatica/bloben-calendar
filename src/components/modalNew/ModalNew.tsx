import './ModalNew.scss';
import { Heading, IconButton } from '@chakra-ui/react';
import CrossIcon from '../eva-icons/cross';
import React from 'react';

interface ModalNewProps {
  children: any;
  handleClose: any;
  maxHeight?: string;
  width?: number;
  preventCloseOnBackdrop?: boolean;
  className?: string;
  closeButton?: boolean;
  footer?: any;
  title?: string;
}
const ModalNew = (props: ModalNewProps) => {
  const { handleClose, preventCloseOnBackdrop } = props;

  const preventDefault = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onClose = () => {
    if (preventCloseOnBackdrop) {
      return;
    }

    handleClose();
  };

  return (
    <div className={'ModalNew__backdrop'} onClick={onClose}>
      <div
        className={`ModalNew__wrapper ${
          props.className ? props.className : ''
        }`}
        onClick={preventDefault}
        id="ModalNew__wrapper"
      >
        {props.closeButton ? (
          <div className={'ModalNew__header'}>
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Close"
              background={'transparent'}
              icon={<CrossIcon className={'ModalNew__icon'} />}
              isRound
              size={'md'}
              autoFocus={false}
              onClick={handleClose}
            />
          </div>
        ) : null}
        <div
          className={
            props.closeButton
              ? 'ModalNew__container-outer--with-header'
              : 'ModalNew__container-outer'
          }
        >
          {props.title ? (
            <Heading
              size={'md'}
              style={{ paddingTop: 16, paddingBottom: 16, paddingLeft: 24 }}
            >
              {props.title}
            </Heading>
          ) : null}
          <div className={'ModalNew__container-inner'}>{props.children}</div>
        </div>
        {props.footer ? (
          <div className={'ModalNew__footer'}>{props.footer}</div>
        ) : (
          <div className={'ModalNew__footer-empty'} />
        )}
      </div>
    </div>
  );
};

export default ModalNew;
