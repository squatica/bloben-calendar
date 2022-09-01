import './ModalNew.scss';
import { Context, StoreContext } from '../../context/store';
import { EvaIcons } from 'bloben-components';
import { Heading, IconButton } from '@chakra-ui/react';
import { parseCssDark } from '../../utils/common';
import React, { useContext } from 'react';

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
  const [store]: [StoreContext] = useContext(Context);

  const { handleClose, preventCloseOnBackdrop, width } = props;

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
    <div
      className={parseCssDark('ModalNew__backdrop', store.isDark)}
      onClick={onClose}
    >
      <div
        className={`${parseCssDark('ModalNew__wrapper', store.isDark)} ${
          props.className ? props.className : ''
        }`}
        style={width ? { width } : undefined}
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
              icon={
                <EvaIcons.Cross
                  className={parseCssDark('ModalNew__icon', store.isDark)}
                />
              }
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
