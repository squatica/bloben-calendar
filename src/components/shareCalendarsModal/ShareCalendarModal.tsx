import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CalDavCalendar, ReduxState } from '../../types/interface';
import { CalendarView } from 'kalend';
import { DateTime } from 'luxon';
import { TOAST_STATUS } from '../../types/enums';
import { WebcalCalendar } from '../../redux/reducers/webcalCalendars';
import { createToast } from '../../utils/common';
import { map } from 'lodash';
import { useSelector } from 'react-redux';
import CalendarSharedApi from '../../api/CalendarSharedApi';
import ChakraInput from '../chakraCustom/ChakraInput';
import ChakraModal from '../chakraCustom/ChakraModal';
import DatePicker from '../datePicker/DatePicker';
import ModalNew from 'components/modalNew/ModalNew';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../separator/Separator';
import SettingsRow from '../../pages/settings/settingsRow/SettingsRow';
import StateReducer from '../../utils/state-reducer';
import Utils from './ShareCalendarModal.utls';

interface SharedCalendarSettingsProps {
  handleClose: any;
  settings: any;
  handleUpdate: any;
}
const SharedCalendarSettings = (props: SharedCalendarSettingsProps) => {
  const { settings, handleUpdate } = props;

  const menuStyle: any = {
    width: '100%',
    justifyContent: 'flex-start',
    textAlign: 'left',
  };

  return (
    <ChakraModal handleClose={props.handleClose}>
      <>
        <SettingsRow title={'Time format'}>
          <Menu>
            <MenuButton
              as={Button}
              style={menuStyle}
              _focus={{ boxShadow: 'none' }}
            >
              {settings.timeFormat}
            </MenuButton>
            <MenuList>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('timeFormat', '24')}
              >
                <span>24</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('timeFormat', '12')}
              >
                <span>12</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </SettingsRow>
        <SettingsRow title={'Start of week'}>
          <Menu>
            <MenuButton
              as={Button}
              style={menuStyle}
              _focus={{ boxShadow: 'none' }}
            >
              {settings.startOfWeek}
            </MenuButton>
            <MenuList>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('startOfWeek', 'Monday')}
              >
                <span>Monday</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('startOfWeek', 'Sunday')}
              >
                <span>Sunday</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </SettingsRow>
        <SettingsRow title={'Default view'}>
          <Menu>
            <MenuButton
              as={Button}
              style={menuStyle}
              _focus={{ boxShadow: 'none' }}
            >
              {settings.defaultView}
            </MenuButton>
            <MenuList>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('defaultView', CalendarView.AGENDA)}
              >
                <span>Agenda</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('defaultView', CalendarView.DAY)}
              >
                <span>Day</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() =>
                  handleUpdate('defaultView', CalendarView.THREE_DAYS)
                }
              >
                <span>3 days</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('defaultView', CalendarView.WEEK)}
              >
                <span>Week</span>
              </MenuItem>
              <MenuItem
                minH="40px"
                onClick={() => handleUpdate('defaultView', CalendarView.MONTH)}
              >
                <span>Month</span>
              </MenuItem>
            </MenuList>
          </Menu>
        </SettingsRow>
      </>
    </ChakraModal>
  );
};

interface ShareCalendarModalProps {
  handleClose: any;
  id?: string;
  loadSharedCalendars: any;
}
const ShareCalendarModal = (props: ShareCalendarModalProps) => {
  const toast = useToast();

  const calDavCalendarsState: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );
  const webcalCalendarsState: WebcalCalendar[] = useSelector(
    (state: ReduxState) => state.webcalCalendars
  );

  const [isLoading, setIsLoading] = useState(false);
  const [settingsOpen, openSettings] = useState(false);

  const { handleClose, id, loadSharedCalendars } = props;

  const [state, dispatchState] = useReducer(StateReducer, Utils.state);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const {
    name,
    calDavCalendars,
    webcalCalendars,
    expireAt,
    password,
    settings,
  }: any = state;

  const onChange = (e: any): void => {
    const value = e.target.value;

    setLocalState(e.target.name, value);
  };

  const onChangeSettings = (key: string, value: string) => {
    const newSettings = { ...settings };

    newSettings[key] = value;
    setLocalState('settings', newSettings);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!id) {
        const response: any = await CalendarSharedApi.postSharedCalendar({
          name,
          calDavCalendars,
          webcalCalendars,
          expireAt,
          password,
          settings,
        });

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }
      } else if (id) {
        const response: any = await CalendarSharedApi.updateSharedCalendar(id, {
          name,
          calDavCalendars,
          webcalCalendars,
          expireAt,
          password,
          settings,
        });

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }
      }

      setIsLoading(false);

      await loadSharedCalendars();

      handleClose();
    } catch (e) {
      // @ts-ignore
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  const loadSharedLink = async () => {
    if (id) {
      const response = await CalendarSharedApi.getSharedCalendar(id);

      if (response.data) {
        const sharedLink = response.data;
        setLocalState('name', sharedLink.name);
        setLocalState('calDavCalendars', map(sharedLink.calDavCalendars, 'id'));
        setLocalState('webcalCalendars', map(sharedLink.webcalCalendars, 'id'));
        if (sharedLink.expireAt) {
          setLocalState('expireAt', DateTime.fromISO(sharedLink.expireAt));
        }
        setLocalState('password', sharedLink.password);
      }
    }
  };

  useEffect(() => {
    loadSharedLink();
  }, []);

  const closeFunc = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  const addCalDavCalendar = (calendarID: string) => {
    let selectedCalendars: string[] = [...calDavCalendars];

    if (selectedCalendars.includes(calendarID)) {
      selectedCalendars = selectedCalendars.filter(
        (item) => item !== calendarID
      );
    } else {
      selectedCalendars.push(calendarID);
    }

    setLocalState('calDavCalendars', selectedCalendars);
  };

  const handleSelectAllCalDAV = () => {
    if (calDavCalendarsState.length === calDavCalendars.length) {
      setLocalState('calDavCalendars', []);
    } else {
      setLocalState('calDavCalendars', map(calDavCalendarsState, 'id'));
    }
  };

  const addWebcalCalendar = (calendarID: string) => {
    let selectedCalendars: string[] = [...webcalCalendars];

    if (selectedCalendars.includes(calendarID)) {
      selectedCalendars = selectedCalendars.filter(
        (item) => item !== calendarID
      );
    } else {
      selectedCalendars.push(calendarID);
    }

    setLocalState('webcalCalendars', selectedCalendars);
  };

  const handleSelectAllWebcal = () => {
    if (webcalCalendars.length === webcalCalendarsState.length) {
      setLocalState('webcalCalendars', []);
    } else {
      setLocalState('webcalCalendars', map(webcalCalendarsState, 'id'));
    }
  };

  const handleSetExpireDate = (dateValue: DateTime | string) => {
    setLocalState('expireAt', dateValue);
  };

  // const groupedCalDavCalendars = keyBy(calDavCalendarsState, 'id');
  // const groupedWebcalCalendars = keyBy(webcalCalendarsState, 'id');

  return (
    <ModalNew
      handleClose={closeFunc}
      title={'Share calendars'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <ChakraInput
            size={'lg'}
            id="name"
            type="text"
            name={'name'}
            onChange={onChange}
            value={name}
          />

          <Separator height={20} />
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              _focus={{ boxShadow: 'none' }}
              style={{ maxWidth: 350, width: 350 }}
            >
              CalDAV calendars ({calDavCalendars.length})
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem onClick={handleSelectAllCalDAV}>
                  <Box style={{ paddingLeft: 22 }}>
                    {calDavCalendars.length === calDavCalendarsState.length
                      ? 'Unselect all'
                      : 'Select all'}
                  </Box>
                </MenuItem>
                {calDavCalendarsState.map((calendar) => (
                  <MenuItem
                    key={calendar.id}
                    onClick={() => addCalDavCalendar(calendar.id)}
                  >
                    <Box>
                      <Checkbox
                        colorScheme="teal"
                        value={calendar.id}
                        isChecked={calDavCalendars.includes(calendar.id)}
                      >
                        {calendar.displayName}
                      </Checkbox>
                    </Box>
                  </MenuItem>
                ))}
              </Stack>
            </MenuList>
          </Menu>

          <Separator height={20} />
          <Menu closeOnSelect={false}>
            <MenuButton
              as={Button}
              _focus={{ boxShadow: 'none' }}
              style={{ maxWidth: 350, width: 350 }}
            >
              Webcal calendars ({webcalCalendars.length})
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem onClick={handleSelectAllWebcal}>
                  <Box style={{ paddingLeft: 22 }}>
                    {webcalCalendars.length === webcalCalendarsState.length
                      ? 'Unselect all'
                      : 'Select all'}
                  </Box>
                </MenuItem>
                {webcalCalendarsState.map((calendar) => (
                  <MenuItem
                    key={calendar.id}
                    onClick={() => addWebcalCalendar(calendar.id)}
                  >
                    <Box>
                      <Checkbox
                        colorScheme="teal"
                        value={calendar.id}
                        isChecked={webcalCalendars.includes(calendar.id)}
                      >
                        {calendar.name}
                      </Checkbox>
                    </Box>
                  </MenuItem>
                ))}
              </Stack>
            </MenuList>
          </Menu>
        </FormControl>
        <Separator height={20} />
        <Button onClick={() => openSettings(true)}>Calendar settings</Button>
        <Separator height={20} />
        <Flex direction={'row'} alignItems={'center'}>
          <Button
            onClick={() =>
              setLocalState('expireAt', expireAt ? null : DateTime.now())
            }
            style={{ background: 'transparent' }}
          >
            <Checkbox
              colorScheme="teal"
              value={'expireAt'}
              isChecked={expireAt !== null}
            />
          </Button>
          <Text>Set expire date</Text>
        </Flex>
        <Separator height={20} />
        {expireAt !== null ? (
          <Menu isLazy>
            <MenuButton
              as={Button}
              _focus={{ boxShadow: 'none' }}
              style={{ width: 150 }}
            >
              <Text style={{ fontWeight: 'normal' }}>
                {expireAt
                  ? expireAt.toFormat('dd-MM-yyyy')
                  : 'Set' + ' expire date'}
              </Text>
            </MenuButton>
            <MenuList>
              <DatePicker
                width={250}
                sideMargin={8}
                selectDate={handleSetExpireDate}
                selectedDate={expireAt}
                withInput
              />
            </MenuList>
          </Menu>
        ) : null}
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'pink'}
            isLoading={isLoading}
            onClick={handleSave}
          >
            Save
          </Button>
        </Center>
        <Separator height={15} />
        {settingsOpen ? (
          <SharedCalendarSettings
            handleClose={() => openSettings(false)}
            settings={settings}
            handleUpdate={onChangeSettings}
          />
        ) : null}
      </>
    </ModalNew>
  );
};

export default ShareCalendarModal;
