import './Header.scss';
import { useSelector } from 'react-redux';
import React, { useContext } from 'react';

import { Context } from 'context/store';
import { IconButton, Spinner } from '@chakra-ui/react';
import MenuIcon from '../eva-icons/menu';
import RefreshIcon from '../eva-icons/refresh';
import Separator from '../separator/Separator';
import SettingsIcon from '../eva-icons/settings';

interface HeaderProps {
  title?: string;
  hasHeaderShadow?: boolean;
  onClick?: any;
  icons?: any;
  handleDrawerIconClick: () => void;
  isDrawerExpanded: boolean;
}
const Header = (props: HeaderProps) => {
  const { handleDrawerIconClick, hasHeaderShadow, isDrawerExpanded } = props;

  const [store, dispatchContext] = useContext(Context);
  const { isDark, isMobile, isSyncing } = store;
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const searchIsOpen: boolean = useSelector((state: any) => state.searchIsOpen);

  const handleOpenSettings = () => {
    setContext('settingsOpen', true);
  };

  const handleRefresh = () => {
    // window.electron?.fetch();
  };

  return (
    <div
      className={`header__wrapper${isDrawerExpanded ? '-expanded' : ''} ${
        (hasHeaderShadow && isDark) || (searchIsOpen && isDark)
          ? 'with-dark-shadow'
          : ''
      }${
        (hasHeaderShadow && isMobile && !isDark) || searchIsOpen
          ? 'with-shadow'
          : ''
      }`}
    >
      <div className={'header__container'}>
        <IconButton
          _focus={{ boxShadow: 'none' }}
          aria-label="Drawer"
          variant={'ghost'}
          icon={<MenuIcon />}
          isRound
          size={'sm'}
          autoFocus={false}
          onClick={handleDrawerIconClick}
        />
      </div>
      <div className={'header__container-align-right'}>
        {isSyncing ? (
          <Spinner color="red.500" />
        ) : (
          <IconButton
            _focus={{ boxShadow: 'none' }}
            variant={'ghost'}
            aria-label="Refresh"
            icon={<RefreshIcon />}
            isRound
            size={'sm'}
            autoFocus={false}
            onClick={handleRefresh}
          />
        )}
        <Separator width={14} />
        <IconButton
          _focus={{ boxShadow: 'none' }}
          variant={'ghost'}
          aria-label="Open settings"
          icon={<SettingsIcon />}
          isRound
          size={'sm'}
          autoFocus={false}
          onClick={handleOpenSettings}
        />
      </div>
    </div>
  );
};

export default Header;
