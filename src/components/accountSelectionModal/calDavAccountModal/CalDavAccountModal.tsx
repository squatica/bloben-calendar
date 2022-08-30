import {
  Button,
  Center,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { CalDavAccount } from '../../../types/interface';
import {
  CalDavAccountModalInitialState,
  calDavAccountModalState,
} from './CalDavAccountModalHelper';
import { DAV_ACCOUNT_TYPE } from '../../../bloben-interface/enums';
import { TOAST_STATUS } from '../../../types/enums';
import {
  addToCaldavAccounts,
  setCaldavCalendars,
} from '../../../redux/actions';
import { createToast } from '../../../utils/common';
import { useDispatch } from 'react-redux';
import CalDavAccountApi from '../../../api/CalDavAccountApi';
import CalDavCalendarApi from '../../../api/CalDavCalendarApi';
import ChakraInput from '../../../components/chakraCustom/ChakraInput';
import ModalNew from '../../modalNew/ModalNew';
import PrimaryButton from '../../chakraCustom/primaryButton/PrimaryButton';
import React, { useEffect, useReducer, useState } from 'react';
import Separator from '../../separator/Separator';
import StateReducer from '../../../utils/state-reducer';

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

  const [state, dispatchState] = useReducer(
    StateReducer,
    calDavAccountModalState
  );
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { username, password, url, accountType } =
    state as CalDavAccountModalInitialState;

  useEffect(() => {
    if (account) {
      setLocalState('url', account.url);
      setLocalState('password', account.password);
      setLocalState('username', account.username);
      setLocalState('accountType', account.accountType);
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
          accountType,
        });

        if (response.data?.message) {
          toast(createToast(response.data.message));
        }

        const accountResponse = await CalDavAccountApi.getCalDavAccount(
          response.data.data.id
        );
        const calendarsResponse = await CalDavCalendarApi.getCalDavCalendars();

        dispatch(addToCaldavAccounts(accountResponse.data));
        dispatch(setCaldavCalendars(calendarsResponse.data));
      }

      handleClose();

      setIsLoading(false);
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
    <ModalNew
      handleClose={closeFunc}
      title={account ? 'Edit Dav account' : 'Add Dav account'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <FormControl>
          <FormLabel htmlFor="accountType">Account type</FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              disabled={!!account}
              _focus={{ boxShadow: 'none' }}
              style={{ width: 80 }}
              onClick={() => setLocalState('type', DAV_ACCOUNT_TYPE.CALDAV)}
            >
              <Text style={{ fontWeight: 'normal' }}>{accountType}</Text>
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem
                  onClick={() =>
                    setLocalState('accountType', DAV_ACCOUNT_TYPE.CALDAV)
                  }
                >
                  {DAV_ACCOUNT_TYPE.CALDAV}
                </MenuItem>
                <MenuItem
                  onClick={() =>
                    setLocalState('accountType', DAV_ACCOUNT_TYPE.CARDDAV)
                  }
                >
                  {DAV_ACCOUNT_TYPE.CARDDAV}
                </MenuItem>
              </Stack>
            </MenuList>
          </Menu>
        </FormControl>
        <Separator height={25} />
        <FormControl>
          <FormLabel htmlFor="url">Url</FormLabel>
          <ChakraInput
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
          <ChakraInput
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
            <ChakraInput
              size={'lg'}
              id="password"
              name={'password'}
              type={show ? 'text' : 'password'}
              onChange={onChange}
              value={password}
            />
            <InputRightElement width="4.5rem">
              <Button
                _focus={{ boxShadow: 'none' }}
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Separator height={25} />
        <Center>
          <PrimaryButton isLoading={isLoading} onClick={addAccount}>
            Confirm
          </PrimaryButton>
        </Center>
        <Separator height={15} />
      </>
    </ModalNew>
  );
};

export default CalDavAccountModal;
