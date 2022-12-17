import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../../context/store';
import { EvaIcons } from 'bloben-components';
import { Organizer } from 'ical-js-parser';
import { ReduxState } from '../../../types/interface';
import { createOrganizerAttendee } from '../../../utils/AttendeeUtils';
import { useSelector } from 'react-redux';
import FormIcon from '../../formIcon/FormIcon';
import React, { useContext, useEffect } from 'react';

interface EventDetailOrganizerProps {
  disabled?: boolean;
  disabledAttendeeChange?: boolean;
  setForm: any;
  organizer: Organizer;
}
const EventDetailOrganizer = (props: EventDetailOrganizerProps) => {
  const { disabled, disabledAttendeeChange, setForm, organizer } = props;

  const [store]: [StoreContext] = useContext(Context);
  const { isDark, emailConfig } = store;
  const user = useSelector((state: ReduxState) => state.user);

  const handleClick = (address: string) => {
    const newOrganizer = createOrganizerAttendee(address, user.username);

    setForm('organizer', newOrganizer);
  };

  useEffect(() => {
    if (!organizer && setForm) {
      const defaultOrganizer = emailConfig.configs.find(
        (item) => item.isDefault
      );

      if (defaultOrganizer) {
        const newOrganizer = createOrganizerAttendee(
          defaultOrganizer.defaultAlias,
          user.username
        );

        setForm('organizer', newOrganizer);
      }
    }
  }, []);

  return organizer ? (
    <Stack
      direction={'row'}
      align={disabled || disabledAttendeeChange ? 'flex-start' : 'center'}
    >
      <FormIcon
        isDark={isDark}
        allVisible
        style={{ paddingTop: disabled || disabledAttendeeChange ? 4 : 0 }}
      >
        <EvaIcons.Email className={'EventDetail-icon'} />
      </FormIcon>
      <Flex
        alignSelf={'center'}
        style={{ height: '100%' }}
        justifyContent={'center'}
        alignItems={'center'}
        direction={'row'}
      >
        <Text style={{ marginRight: 8 }}>Organizer: </Text>
        <Menu>
          <MenuButton
            as={Button}
            _focus={{ boxShadow: 'none' }}
            disabled={disabled}
          >
            {organizer?.mailto}
          </MenuButton>
          <MenuList>
            {emailConfig.configs.map((item) => {
              return (
                <MenuItem
                  key={item.id}
                  onClick={() => handleClick(item.defaultAlias)}
                >
                  {item.defaultAlias}
                </MenuItem>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>
    </Stack>
  ) : null;
};

export default EventDetailOrganizer;
