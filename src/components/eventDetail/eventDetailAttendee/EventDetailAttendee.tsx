import React, { useContext, useState } from 'react';

import './EventDetailAttendee.scss';
import { Attendee, createAttendee } from '../../../utils/AttendeeUtils';
import {
  Button,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Context } from '../../../context/store';
import { EvaIcons } from 'components/eva-icons';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import FormIcon from '../../formIcon/FormIcon';
import TrashIcon from '../../eva-icons/trash';
import Validator from '../../../utils/Validator';

const renderAttendees = (
  attendees: Attendee[],
  removeAttendee: any,
  updateAttendee: any,
  disabled?: boolean
) => {
  return attendees.map((item) => {
    return (
      <Flex
        key={item.mailto}
        direction={'row'}
        paddingLeft={2}
        style={{ width: '100%' }}
      >
        <Text>{item.mailto}</Text>
        <Spacer />
        {disabled ? null : (
          <Menu closeOnSelect>
            <MenuButton
              as={Button}
              style={{ height: 'auto', marginRight: 4 }}
              size={'xs'}
              _focus={{ boxShadow: 'none' }}
            >
              {item?.ROLE
                ? item?.ROLE?.slice(0, item?.ROLE?.indexOf('-'))
                : item?.ROLE}
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem
                  onClick={() => {
                    updateAttendee({
                      ...item,
                      ROLE: 'REQ-PARTICIPANT',
                    });
                  }}
                >
                  REQ
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    updateAttendee({
                      ...item,
                      ROLE: 'OPT-PARTICIPANT',
                    });
                  }}
                >
                  OPT
                </MenuItem>
              </Stack>
            </MenuList>
          </Menu>
        )}
        {disabled ? null : (
          <IconButton
            _focus={{ boxShadow: 'none' }}
            variant={'ghost'}
            aria-label="Menu"
            background={'transparent'}
            icon={<TrashIcon className={'AttendeeIcon'} />}
            isRound
            size={'xs'}
            autoFocus={false}
            onClick={() => removeAttendee(item)}
          />
        )}
      </Flex>
    );
  });
};

interface EventDetailAttendeeProps {
  addAttendee?: any;
  removeAttendee?: any;
  updateAttendee?: any;
  attendees: Attendee[];
  disabled?: boolean;
}
const EventDetailAttendee = (props: EventDetailAttendeeProps) => {
  const toast = useToast();

  const [isListVisible, setListVisible] = useState(false);
  const [attendee, setAttendee] = useState('');
  const { disabled, addAttendee, removeAttendee, updateAttendee, attendees } =
    props;

  const [store] = useContext(Context);
  const { isDark } = store;

  const onChange = (e: any) => {
    setAttendee(e.target.value);
  };

  const handleSubmit = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      const isEmail = Validator.isEmail(attendee);

      if (!isEmail) {
        toast(
          createToast(`"${attendee}" is not valid email`, TOAST_STATUS.ERROR)
        );
        return;
      }

      const newAttendee = createAttendee({
        email: attendee,
        name: attendee,
      });
      addAttendee(newAttendee);
      setAttendee('');

      if (attendees.length < 2 && !isListVisible) {
        setListVisible(true);
      }
    }
  };

  const renderedAttendees = renderAttendees(
    attendees,
    removeAttendee,
    updateAttendee,
    disabled
  );

  return (
    <Flex
      direction={'column'}
      style={{
        width: '90%',
      }}
    >
      <Stack direction={'row'} align={'center'}>
        <FormIcon isDark={isDark} allVisible>
          <EvaIcons.Person className={'EventDetail-icon'} />
        </FormIcon>
        {!disabled ? (
          <Input
            size={'md'}
            type="text"
            placeholder="Add attendee"
            name={'attendee'}
            value={attendee}
            variant={disabled ? 'unstyled' : 'outline'}
            onChange={onChange}
            isDisabled={disabled}
            autoComplete={'off'}
            onKeyPress={handleSubmit}
          />
        ) : attendees.length ? (
          <Stack
            direction={'column'}
            spacing={2}
            style={{
              width: '100%',
              alignItems: 'flex-start',
              marginTop: 8,
            }}
          >
            <Button
              _focus={{ boxShadow: 'none' }}
              style={{ height: 40 }}
              width={'100%'}
              justifyContent={'flex-start'}
              onClick={() => setListVisible(!isListVisible)}
            >
              <Text style={{ fontWeight: 'normal' }}>
                {attendees.length} attendee(s)
              </Text>
            </Button>
            {isListVisible ? renderedAttendees : null}
          </Stack>
        ) : null}
      </Stack>
      {!disabled && attendees.length ? (
        <Stack direction={'row'} align={'center'} style={{ marginBottom: 4 }}>
          <FormIcon isDark={isDark} allVisible hidden>
            <EvaIcons.Person className={'EventDetail-icon'} />
          </FormIcon>
          <Stack
            direction={'column'}
            spacing={2}
            style={{ width: '100%', marginTop: 2, marginBottom: 2 }}
          >
            <Button
              _focus={{ boxShadow: 'none' }}
              style={{ height: 40 }}
              width={'100%'}
              justifyContent={'flex-start'}
              onClick={() => setListVisible(!isListVisible)}
            >
              <Text style={{ fontWeight: 'normal' }}>
                {attendees.length} attendee(s)
              </Text>
            </Button>
            {isListVisible ? renderedAttendees : null}
          </Stack>
        </Stack>
      ) : null}
    </Flex>
  );
};

export default EventDetailAttendee;
