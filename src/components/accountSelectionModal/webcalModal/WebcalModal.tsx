import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
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
import ChakraModal from '../../chakraCustom/ChakraModal';
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

  const { name, url, syncFrequency, color }: any = state;

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

  return (
    <ChakraModal
      isOpen={true}
      handleClose={closeFunc}
      minWidth={350}
      title={'Add webcal calendar'}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="url">Url</FormLabel>
          <Input
            size={'lg'}
            id="url"
            type="text"
            name={'url'}
            onChange={onChange}
            value={url}
          />
          <Separator height={18} />
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
            <Input
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
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'teal'}
            isLoading={isLoading}
            onClick={addWebcalCalendar}
          >
            Confirm
          </Button>
        </Center>
        <Separator height={15} />
      </>
    </ChakraModal>
  );
};

export default WebcalModal;
