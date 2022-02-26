import '../EventDetail.scss';

import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { CalDavCalendar, ReduxState } from '../../../types/interface';
import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { useSelector } from 'react-redux';
import FormIcon from '../../formIcon/FormIcon';
import React, { useContext } from 'react';

const renderCalendars = (data: CalDavCalendar[], selectCalendar: any) => {
  return data.map((item) => {
    return (
      <MenuItem onClick={() => selectCalendar(item)} key={item.url}>
        {item.displayName || 'Unknown' + ' name'}
      </MenuItem>
    );
  });
};

interface EventDetailCalendarProps {
  calendar: any;
  selectCalendar?: any;
  disabled?: boolean;
}
const EventDetailCalendar = (props: EventDetailCalendarProps) => {
  const { calendar, selectCalendar, disabled } = props;

  const calendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );
  const [store] = useContext(Context);
  const { isDark } = store;

  const renderedCalendar = renderCalendars(calendars, selectCalendar);

  return (
    <Stack direction={'row'} align={'center'}>
      <FormIcon desktopVisible isDark={isDark}>
        <EvaIcons.Calendar className={'EventDetail-icon'} />
      </FormIcon>
      {disabled ? (
        <Text>{calendar.displayName}</Text>
      ) : (
        <Menu>
          <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
            {calendar.displayName}
          </MenuButton>
          <MenuList>{renderedCalendar}</MenuList>
        </Menu>
      )}
    </Stack>
  );
};

export default EventDetailCalendar;
