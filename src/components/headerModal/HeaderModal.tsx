import './HeaderModal.scss';
import { EvaIcons } from 'components/eva-icons';
import { IconButton, Stack } from '@chakra-ui/react';
import { parseCssDark } from '../../utils/common';
import ButtonIcon from '../button/buttonIcon/ButtonIcon';
import React, { useEffect, useState } from 'react';

const Icons = (props: any) => props.icons.map((icon: any) => icon);

interface HeaderModalMobileProps {
  hasHeaderShadow?: boolean;
  goBack?: any;
  onDelete: any;
  handleSave: any;
  handleEdit?: any;
  title?: string;
  icons: any;
  isMobile: boolean;
  isDark: boolean;
  children?: any;
  style?: any;
  showBack?: boolean;
}
// tslint:disable-next-line:cyclomatic-complexity
const HeaderModalMobile = (props: HeaderModalMobileProps) => {
  const {
    hasHeaderShadow,
    goBack,
    onDelete,
    handleSave,
    handleEdit,
    title,
    icons,
    isDark,
    isMobile,
    children,
    style,
    showBack,
  } = props;

  return (
    <div
      className={`HeaderModal__row${
        hasHeaderShadow && isMobile && !isDark ? '-shadow' : ''
      }${hasHeaderShadow && isMobile && isDark ? '-shadow-dark' : ''}
      `}
      style={style}
    >
      <div className={'HeaderModal__icon-left'}>
        {(isMobile && goBack) || (showBack && goBack) ? (
          <ButtonIcon onClick={goBack} isDark={isDark}>
            <EvaIcons.ArrowBack />
          </ButtonIcon>
        ) : null}
      </div>
      {children ? children : null}
      {title ? (
        <div className={'HeaderModal__container--title'}>
          <p className={`HeaderModal__title${isDark ? '-dark' : ''}`}>
            {title}
          </p>
        </div>
      ) : null}
      <div className={'HeaderModal__container--icons'}>
        <Stack direction={'row'} spacing={2}>
          {handleSave ? (
            <ButtonIcon onClick={handleSave} isDark={isDark}>
              <EvaIcons.Check
                className={parseCssDark('HeaderModal__icon', isDark)}
              />
            </ButtonIcon>
          ) : null}
          {onDelete ? (
            <IconButton
              aria-label="Delete"
              icon={
                <EvaIcons.Trash
                  className={parseCssDark('HeaderModal__icon', isDark)}
                />
              }
              isRound
              size={'sm'}
              onClick={onDelete}
            />
          ) : null}
          {handleEdit ? (
            <IconButton
              aria-label="Edit"
              icon={
                <EvaIcons.Edit
                  className={parseCssDark('HeaderModal__icon', isDark)}
                />
              }
              isRound
              size={'sm'}
              onClick={handleEdit}
            />
          ) : null}
          {icons ? <Icons icons={icons} /> : null}
        </Stack>
      </div>
    </div>
  );
};

interface HeaderModalProps {
  hasHeaderShadow?: boolean;
  goBack?: any;
  onDelete?: any;
  handleFavourite?: any;
  isFavourite?: any;
  handleSave?: any;
  handleEdit?: any;
  title?: string;
  children?: any;
  icons?: any;
  animation?: string;
  isMobile: boolean;
  handleDelete?: any;
  onClose?: any;
  isDark: boolean;
  style?: any;
  childrenStyle?: any;
  showBack?: boolean;
}
const HeaderModal = (props: HeaderModalProps) => {
  const {
    hasHeaderShadow,
    icons,
    handleDelete,
    handleSave,
    handleEdit,
    title,
    isMobile,
    isDark,
    goBack,
    children,
    style,
    childrenStyle,
    showBack,
  } = props;

  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (hasHeaderShadow) {
      setAnimation('HeaderModal__text-visible');
    } else {
      setAnimation('HeaderModal__text-hidden');
    }
  }, [hasHeaderShadow]);

  return (
    <div
      className={`HeaderModal__wrapper${isDark ? '-dark' : ''} ${
        hasHeaderShadow && isMobile && !isDark ? 'with-shadow' : ''
      } ${animation}`}
      style={style}
    >
      <HeaderModalMobile
        icons={icons}
        hasHeaderShadow={hasHeaderShadow}
        goBack={goBack}
        onDelete={handleDelete}
        handleSave={handleSave}
        handleEdit={handleEdit}
        title={title}
        isMobile={isMobile}
        isDark={isDark}
        style={childrenStyle}
        showBack={showBack}
      >
        {children}
      </HeaderModalMobile>
    </div>
  );
};

export default HeaderModal;
