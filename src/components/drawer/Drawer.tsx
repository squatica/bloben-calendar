import React, { useEffect, useState } from 'react';

import '../button/buttonBase/ButtonBase.scss';
import './Drawer.scss';
import { Button, Stack } from '@chakra-ui/react';
import { DRAWER_PATH } from '../../types/enums';
import DrawerCalendars from './drawerContent/DrawerCalendars';

interface DrawerProps {
  isOpen: boolean;
  selected: DRAWER_PATH;
  setSelected: any;
}
const Drawer = (props: DrawerProps) => {
  const { selected, setSelected } = props;

  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const { isOpen } = props;

  useEffect(() => {
    if (isOpen) {
      setIsOpenInternal(true);
      // setAnimation("Drawer__expand");
    } else {
      setIsOpenInternal(false);
      //
      // setTimeout(() => {
      //   setIsOpenInternal(false);
      // }, 480);
      // setAnimation("Drawer__collapse");
    }
  }, [isOpen]);

  const calendarSelected = DRAWER_PATH.CALENDAR === selected;

  return isOpenInternal ? (
    <div className={`CalendarDrawer__wrapper`}>
      {/*<DrawerHeader selected={selected} setSelected={setSelected} />*/}
      <div className={'Drawer__content'}>
        <Stack>
          <Button
            _focus={{ boxShadow: 'none' }}
            style={{ fontWeight: calendarSelected ? 'bold' : 'normal' }}
            variant={calendarSelected ? 'solid' : 'ghost'}
            onClick={() => setSelected(DRAWER_PATH.CALENDAR)}
            isFullWidth={true}
            fontSize={14}
            justifyContent={'flex-start'}
          >
            Calendar
          </Button>
        </Stack>
        <DrawerCalendars path={selected} />
      </div>
    </div>
  ) : null;
};

export default Drawer;
