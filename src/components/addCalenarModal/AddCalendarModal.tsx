import {
  AddAlarmData,
  AppAlarm,
  addAlarm,
  createToast,
  removeAlarm,
  updateAlarm,
} from '../../utils/common';
import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  useToast,
} from '@chakra-ui/react';
import { CalDavAccount, CalDavCalendar } from '../../types/interface';
import { HexColorPicker } from 'react-colorful';
import { TOAST_STATUS } from '../../types/enums';
import { map } from 'lodash';
import Alarms from '../eventDetail/eventDetailAlarm/EventDetailAlarm';
import CalDavCalendarApi from '../../api/CalDavCalendarApi';
import ModalNew from 'components/modalNew/ModalNew';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../separator/Separator';
import StateReducer from '../../utils/state-reducer';
import Utils from './AddCalendarModal.utils';

interface AddCalendarModalProps {
  handleClose: any;
  account?: CalDavAccount;
  calendar?: CalDavCalendar;
}
const AddCalendarModal = (props: AddCalendarModalProps) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { handleClose, account, calendar } = props;

  const [state, dispatchState] = useReducer(StateReducer, Utils.state);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { name, color, components, alarms }: any = state;

  const onChange = (e: any): void => {
    const value = e.target.value;

    setLocalState(e.target.name, value);
  };

  const saveCalendar = async () => {
    if (!account) {
      toast(createToast('CalDAV account not found', TOAST_STATUS.ERROR));
      handleClose();
      return;
    }
    setIsLoading(true);
    try {
      if (!calendar) {
        const response: any = await CalDavCalendarApi.createCalendar({
          name,
          color,
          components,
          accountID: account.id,
        });

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }
      } else if (calendar) {
        const response: any = await CalDavCalendarApi.updateCalendar(
          calendar.id,
          {
            name,
            color,
            alarms: map(alarms, (alarm) => ({
              amount: alarm.amount,
              timeUnit: alarm.timeUnit,
            })),
          }
        );

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }
      }

      setIsLoading(false);
      handleClose();
    } catch (e) {
      // @ts-ignore
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const updateCalendar = async () => {
    if (!account) {
      toast(createToast('CalDAV account not found', TOAST_STATUS.ERROR));
      handleClose();
      return;
    }
    setIsLoading(true);
    try {
      const response: any = await CalDavCalendarApi.createCalendar({
        name,
        color,
        components,
        accountID: account.id,
      });

      if (response.data?.message) {
        toast(createToast(response.data.message));
      }

      setIsLoading(false);
      handleClose();
    } catch (e) {
      // @ts-ignore
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (calendar) {
      setLocalState('name', calendar.displayName);
      setLocalState('color', calendar.color);
      setLocalState('components', calendar.components);
      setLocalState('alarms', calendar.alarms);
    }
  }, []);

  const setColor = (color: any) => {
    setLocalState('color', color);
  };

  const closeFunc = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  const checkComponents = (component: string) => {
    let selectedComponents: string[] = [...components];

    if (selectedComponents.includes(component)) {
      selectedComponents = selectedComponents.filter(
        (item) => item !== component
      );
    } else {
      selectedComponents.push(component);
    }

    setLocalState('components', selectedComponents);
  };

  const addAlarmEvent = (item: AddAlarmData) => {
    addAlarm(item, setLocalState, alarms);
  };

  const removeAlarmEvent = (item: AppAlarm) => {
    removeAlarm(item, setLocalState, alarms);
  };
  const updateAlarmEvent = (item: AppAlarm) => {
    updateAlarm(item, setLocalState, alarms);
  };

  return (
    <ModalNew
      handleClose={closeFunc}
      title={'Create calendar'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            size={'lg'}
            id="name"
            type="text"
            name={'name'}
            onChange={onChange}
            value={name}
          />
          <Separator height={18} />
          <Flex direction={'row'}>
            {components.map((component: string) => (
              <Tag
                key={component}
                marginRight={4}
                borderRadius={10}
                padding={1}
                size={'xs'}
              >
                {component}
              </Tag>
            ))}
          </Flex>
          <Separator height={10} />
          {!calendar ? (
            <Menu closeOnSelect={false}>
              <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
                Select components
              </MenuButton>
              <MenuList>
                <Stack spacing={1}>
                  <MenuItem onClick={() => checkComponents('VEVENT')}>
                    <Box>
                      <Checkbox
                        colorScheme="teal"
                        value={'VEVENT'}
                        isChecked={components.includes('VEVENT')}
                      >
                        VEVENT
                      </Checkbox>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => checkComponents('VTODO')}>
                    <Box>
                      <Checkbox
                        colorScheme="teal"
                        value={'VTODO'}
                        isChecked={components.includes('VTODO')}
                      >
                        VTODO
                      </Checkbox>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={() => checkComponents('VJOURNAL')}>
                    <Box>
                      <Checkbox
                        colorScheme="teal"
                        value={'VJOURNAL'}
                        isChecked={components.includes('VJOURNAL')}
                      >
                        VJOURNAL
                      </Checkbox>
                    </Box>
                  </MenuItem>
                </Stack>
              </MenuList>
            </Menu>
          ) : null}
          <Separator height={18} />
          <FormLabel htmlFor="color">Color</FormLabel>
          <Popover>
            <PopoverTrigger>
              <Button style={{ width: 100, background: color, color: 'white' }}>
                {color}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <HexColorPicker color={color} onChange={setColor} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </FormControl>
        <Separator height={25} />
        <Alarms
          alarms={alarms}
          addAlarm={addAlarmEvent}
          removeAlarm={removeAlarmEvent}
          updateAlarm={updateAlarmEvent}
        />
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'pink'}
            isLoading={isLoading}
            onClick={saveCalendar}
          >
            Save
          </Button>
        </Center>
        <Separator height={15} />
      </>
    </ModalNew>
  );
};

export default AddCalendarModal;
