import './DrawerHeader.scss';
import { Button } from '@chakra-ui/react';
import { DRAWER_PATH } from '../../../types/enums';
import React from 'react';
import Separator from '../../separator/Separator';

interface DrawerHeaderProps {
  selected: DRAWER_PATH;
  setSelected: (value: DRAWER_PATH) => void;
}
const DrawerHeader = (props: DrawerHeaderProps) => {
  const { selected, setSelected } = props;

  const calendarSelected = DRAWER_PATH.CALENDAR === selected;

  return (
    <div className={'DrawerHeader__container'}>
      <Separator width={6} height={0} />
      <Button
        _focus={{ boxShadow: 'none' }}
        style={{ fontWeight: calendarSelected ? 'bold' : 'normal' }}
        variant={calendarSelected ? 'solid' : 'ghost'}
        onClick={() => setSelected(DRAWER_PATH.CALENDAR)}
        width={'full'}
        fontSize={14}
      >
        Calendar
      </Button>
    </div>
  );
};

export default DrawerHeader;
