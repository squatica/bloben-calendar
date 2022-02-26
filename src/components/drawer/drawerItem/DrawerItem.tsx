import './DrawerItem.scss';
import { AppSettings, ReduxState } from '../../../types/interface';
import { Button } from '@chakra-ui/react';
import { EvaIcons } from '../../eva-icons';
import { updateSettings } from '../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

interface DrawerItemProps {
  key: string;
  calendar: any;
}
const DrawerItem = (props: DrawerItemProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const dispatch = useDispatch();
  const settings: AppSettings = useSelector(
    (state: ReduxState) => state.settings
  );
  const { hiddenCalendarIDs } = settings;

  const { calendar } = props;

  const { color, displayName, content } = calendar;

  useEffect(() => {
    setIsHidden(hiddenCalendarIDs.includes(calendar.id));
  }, []);

  const handleClick = (): void => {
    let hiddenIDs = [...hiddenCalendarIDs];

    if (isHidden) {
      hiddenIDs = hiddenIDs.filter((item) => item !== calendar.id);
      setIsHidden(false);
    } else {
      hiddenIDs = [...hiddenCalendarIDs, ...[calendar.id]];
      setIsHidden(true);
    }

    dispatch(updateSettings('hiddenCalendarIDs', hiddenIDs));
  };

  return (
    <Button
      _focus={{ boxShadow: 'none' }}
      // colorScheme="whiteAlpha"
      variant="ghost"
      onClick={handleClick}
      isFullWidth
      justifyContent={'flex-start'}
      fontWeight={400}
      leftIcon={
        isHidden ? (
          <EvaIcons.RadioOff
            className={'svg-icon' + ' drawer-icon'}
            fill={color}
          />
        ) : (
          <EvaIcons.CircleFill
            className={'svg-icon drawer-icon'}
            fill={color}
          />
        )
      }
    >
      {displayName || content.name}
    </Button>
  );
};

export default DrawerItem;
