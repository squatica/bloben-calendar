import {
  Button,
  Center,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightAddon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/react';
import { HexColorPicker } from 'react-colorful';
import { TOAST_STATUS } from '../../../types/enums';
import { WebcalCalendar } from '../../../redux/reducers/webcalCalendars';
import { createToast } from '../../../utils/common';
import { map } from 'lodash';
import ChakraInput from '../../chakraCustom/ChakraInput';
import ModalNew from 'components/modalNew/ModalNew';
import PrimaryButton from '../../chakraCustom/primaryButton/PrimaryButton';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../../separator/Separator';
import StateReducer from '../../../utils/state-reducer';
import Utils from './WebcalModal.utils';
import WebcalCalendarApi from '../../../api/WebcalCalendarApi';

interface WebcalModalProps {
  handleClose: any;
  webcalCalendar?: WebcalCalendar;
}
const WebcalModal = (props: WebcalModalProps) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { handleClose, webcalCalendar } = props;

  const [state, dispatchState] = useReducer(StateReducer, Utils.state);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { name, url, syncFrequency, color, alarms }: any = state;

  const onChange = (e: any): void => {
    const value = e.target.value;

    setLocalState(e.target.name, value);
  };

  const setColor = (color: any) => {
    setLocalState('color', color);
  };

  useEffect(() => {
    if (webcalCalendar) {
      setLocalState('url', webcalCalendar.url);
      setLocalState('color', webcalCalendar.color);
      setLocalState('name', webcalCalendar.name);
      setLocalState('syncFrequency', webcalCalendar.syncFrequency);
      setLocalState('alarms', webcalCalendar.alarms);
    }
  }, []);

  const addWebcalCalendar = async () => {
    if (syncFrequency < 30) {
      toast(
        createToast(
          'Sync frequency has to be minimum 30 minutes',
          TOAST_STATUS.ERROR
        )
      );
      return;
    }

    setIsLoading(true);
    try {
      if (webcalCalendar) {
        const response: any = await WebcalCalendarApi.updateWebcalCalendar(
          webcalCalendar.id,
          {
            name,
            color,
            url,
            syncFrequency,
            alarms: map(alarms, (alarm) => ({
              amount: alarm.amount,
              timeUnit: alarm.timeUnit,
            })),
          }
        );

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }
      } else {
        const response: any = await WebcalCalendarApi.createWebcalCalendar({
          name,
          color,
          url,
          syncFrequency,
          alarms: map(alarms, (alarm) => ({
            amount: alarm.amount,
            timeUnit: alarm.timeUnit,
          })),
        });

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

  const closeFunc = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  // const addAlarmEvent = (item: AddAlarmData) => {
  //   addAlarm(item, setLocalState, alarms);
  // };
  //
  // const removeAlarmEvent = (item: AppAlarm) => {
  //   removeAlarm(item, setLocalState, alarms);
  // };
  // const updateAlarmEvent = (item: AppAlarm) => {
  //   updateAlarm(item, setLocalState, alarms);
  // };

  return (
    <ModalNew
      handleClose={closeFunc}
      title={'Add webcal calendar'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="url">Url</FormLabel>
          <ChakraInput
            size={'lg'}
            id="url"
            type="text"
            name={'url'}
            onChange={onChange}
            value={url}
          />
          <Separator height={18} />
          <FormLabel htmlFor="name">Name</FormLabel>
          <ChakraInput
            size={'lg'}
            id="name"
            type="text"
            name={'name'}
            onChange={onChange}
            value={name}
          />
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
          <Separator height={18} />
          <FormLabel htmlFor="color">Sync frequency</FormLabel>
          <InputGroup size={'lg'}>
            <ChakraInput
              size={'lg'}
              id="syncFrequency"
              name={'syncFrequency'}
              onChange={onChange}
              value={syncFrequency}
              type={'number'}
              min={30}
            />
            <InputRightAddon>minutes</InputRightAddon>
          </InputGroup>
        </FormControl>
        {/*DISABLED*/}
        {/*<Separator height={25} />*/}
        {/*<Alarms*/}
        {/*  alarms={alarms}*/}
        {/*  addAlarm={addAlarmEvent}*/}
        {/*  removeAlarm={removeAlarmEvent}*/}
        {/*  updateAlarm={updateAlarmEvent}*/}
        {/*/>*/}
        <Separator height={25} />
        <Center>
          <PrimaryButton isLoading={isLoading} onClick={addWebcalCalendar}>
            Confirm
          </PrimaryButton>
        </Center>
        <Separator height={15} />
      </>
    </ModalNew>
  );
};

export default WebcalModal;
