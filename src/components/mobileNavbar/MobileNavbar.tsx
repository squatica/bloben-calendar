import './MobileNavbar.scss';
import { Context, StoreContext } from '../../context/store';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import { parseCssDark } from '../../utils/common';
import CalendarIcon from '../eva-icons/calendar';
import ChevronLeft from '../eva-icons/chevron-left';
import ChevronRight from '../eva-icons/chevron-right';
import MenuIcon from '../eva-icons/menu';
import React, { useContext } from 'react';
import Separator from '../separator/Separator';

interface MobileNavbarProps {
  kalendRef: any;
  openBottomSheet: any;
}
const MobileNavbar = (props: MobileNavbarProps) => {
  const [store]: [StoreContext] = useContext(Context);
  const { kalendRef, openBottomSheet } = props;

  const goForward = () => {
    kalendRef?.current?.navigateForward();
  };
  const goBackwards = () => {
    kalendRef?.current?.navigateBackwards();
  };
  const goToday = () => {
    kalendRef?.current?.navigateToTodayDate();
  };

  return (
    <div className={parseCssDark('MobileNavbar__wrapper', store.isDark)}>
      <div className={parseCssDark('MobileNavbar__container', store.isDark)}>
        <Flex
          paddingLeft={8}
          paddingRight={8}
          alignItems={'center'}
          height={'100%'}
        >
          <Flex>
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Menu"
              icon={
                <ChevronLeft
                  className={parseCssDark('MobileNavbar__icon', store.isDark)}
                />
              }
              isRound
              size={'lg'}
              autoFocus={false}
              onClick={goBackwards}
            />
            <Separator width={10} />
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Menu"
              icon={
                <ChevronRight
                  className={parseCssDark('MobileNavbar__icon', store.isDark)}
                />
              }
              isRound
              size={'lg'}
              autoFocus={false}
              onClick={goForward}
            />
          </Flex>
          <Spacer />
          <Flex direction={'row'}>
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Today"
              icon={
                <CalendarIcon
                  className={parseCssDark('MobileNavbar__icon', store.isDark)}
                />
              }
              isRound
              size={'lg'}
              autoFocus={false}
              onClick={goToday}
            />
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Menu"
              icon={
                <MenuIcon
                  className={parseCssDark('MobileNavbar__icon', store.isDark)}
                />
              }
              isRound
              size={'lg'}
              autoFocus={false}
              onClick={openBottomSheet}
            />
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

export default MobileNavbar;
