import './MobileNavbar.scss';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import CalendarIcon from '../eva-icons/calendar';
import ChevronLeft from '../eva-icons/chevron-left';
import ChevronRight from '../eva-icons/chevron-right';
import MenuIcon from '../eva-icons/menu';
import React from 'react';
import Separator from '../separator/Separator';

interface MobileNavbarProps {
  kalendRef: any;
  openBottomSheet: any;
}
const MobileNavbar = (props: MobileNavbarProps) => {
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
    <div className={'MobileNavbar__wrapper'}>
      <div className={'MobileNavbar__container'}>
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
              icon={<ChevronLeft className={'MobileNavbar__icon'} />}
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
              icon={<ChevronRight className={'MobileNavbar__icon'} />}
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
              icon={<CalendarIcon className={'MobileNavbar__icon'} />}
              isRound
              size={'lg'}
              autoFocus={false}
              onClick={goToday}
            />
            <IconButton
              _focus={{ boxShadow: 'none' }}
              variant={'ghost'}
              aria-label="Menu"
              icon={<MenuIcon className={'MobileNavbar__icon'} />}
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
