import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { CalDavAccount } from '../../../types/interface';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import { setWebcalCalendars } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import ChakraModal from '../../chakraCustom/ChakraModal';
import React, { useReducer, useState } from 'react';
import Separator from '../../separator/Separator';
import StateReducer from '../../../utils/state-reducer';
import Utils from './WebcalModal.utils';
import WebcalCalendarApi from '../../../api/WebcalCalendarApi';

interface WebcalModalProps {
  handleClose: any;
  account?: CalDavAccount;
}
const WebcalModal = (props: WebcalModalProps) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const { handleClose } = props;

  const dispatch = useDispatch();

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

  const addWebcalCalendar = async () => {
    setIsLoading(true);
    try {
      const response: any = await WebcalCalendarApi.createWebcalCalendar({
        name,
        color,
        url,
        syncFrequency,
      });

      if (response.data?.message) {
        toast(createToast(response.data.message));

        const webcalResponse = await WebcalCalendarApi.getWebcalCalendars();

        dispatch(setWebcalCalendars(webcalResponse.data));
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
          <Input
            size={'lg'}
            id="color"
            name={'color'}
            onChange={onChange}
            value={color}
          />
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
