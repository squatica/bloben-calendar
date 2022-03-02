import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react';
import { CalDavAccount } from '../../../types/interface';
import { TOAST_STATUS } from '../../../types/enums';
import {
  addToCaldavAccounts,
  setCaldavCalendars,
} from '../../../redux/actions';
import { createToast } from '../../../utils/common';
import { useDispatch } from 'react-redux';
import CalDavAccountApi from '../../../api/CalDavAccountApi';
import CalDavCalendarApi from '../../../api/CalDavCalendarApi';
import ChakraModal from '../../chakraCustom/ChakraModal';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../../separator/Separator';
import StateReducer from '../../../utils/state-reducer';
import Utils from './CalDavAccountModal.utils';

interface CalDavAccountModalProps {
  handleClose: any;
  account?: CalDavAccount;
}
const CalDavAccountModal = (props: CalDavAccountModalProps) => {
  const toast = useToast();

  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const [isLoading, setIsLoading] = useState(false);

  const { account, handleClose } = props;

  const dispatch = useDispatch();

  const [state, dispatchState] = useReducer(StateReducer, Utils.state);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { username, password, url }: any = state;

  useEffect(() => {
    if (account) {
      setLocalState('url', account.url);
      setLocalState('password', account.password);
      setLocalState('username', account.username);
    }
  }, []);

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;

    setLocalState(name, value);
  };

  const addAccount = async () => {
    setIsLoading(true);
    try {
      if (!account) {
        const response: any = await CalDavAccountApi.createCalDavAccount({
          username,
          password,
          url,
        });

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }

        const accountResponse = await CalDavAccountApi.getCalDavAccount(
          response.data.data.id
        );

        dispatch(addToCaldavAccounts(accountResponse.data));

        const calendarsResponse = await CalDavCalendarApi.getCalDavCalendars();

        dispatch(setCaldavCalendars(calendarsResponse.data));
      } else {
        // if (response.status === 200) {
        //   toast(createToast(response.data.message));
        // }
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
      title={account ? 'Edit CalDavAccount' : 'Add CalDavAccount'}
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
            disabled={account !== undefined}
          />
          <Separator height={18} />
          <FormLabel htmlFor="username">Username</FormLabel>
          <Input
            size={'lg'}
            id="username"
            type="text"
            name={'username'}
            onChange={onChange}
            value={username}
            disabled={account !== undefined}
          />
          <Separator height={18} />
          <FormLabel htmlFor="password">Password</FormLabel>
          <InputGroup size={'lg'}>
            <Input
              size={'lg'}
              id="password"
              name={'password'}
              type={show ? 'text' : 'password'}
              onChange={onChange}
              value={password}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Separator height={25} />
        <Center>
          <Button
            _focus={{ boxShadow: 'none' }}
            colorScheme={'teal'}
            isLoading={isLoading}
            onClick={addAccount}
          >
            Confirm
          </Button>
        </Center>
        <Separator height={15} />
      </>
    </ChakraModal>
  );
};

export default CalDavAccountModal;
