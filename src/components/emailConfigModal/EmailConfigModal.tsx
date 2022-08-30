import {
  Center,
  FormControl,
  FormLabel,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../context/store';
import { TOAST_STATUS } from '../../types/enums';
import { createToast } from '../../utils/common';
import ChakraInput from '../chakraCustom/ChakraInput';
import ModalNew from '../../components/modalNew/ModalNew';
import PrimaryButton from '../chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Separator from '../separator/Separator';
import StateReducer from '../../utils/state-reducer';
import UserEmailConfigApi from '../../api/UserEmailConfigApi';

interface EmailConfigModalProps {
  handleClose: any;
}

const initialState: any = {
  smtpEmail: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpHost: '',
  smtpPassword: '',
  imapPort: 143,
  imapHost: '',
  imapUsername: '',
  imapPassword: '',
  imapSyncingInterval: 30,
};

const EmailConfigModal = (props: EmailConfigModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [store, dispatchContext]: [StoreContext, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };
  const { handleClose } = props;

  const [state, dispatchState] = useReducer(StateReducer, initialState);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const {
    smtpHost,
    smtpPort,
    smtpPassword,
    smtpUsername,
    smtpEmail,
    imapPassword,
    imapUsername,
    imapHost,
    imapPort,
    imapSyncingInterval,
  } = state as any;

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;

    setLocalState(name, value);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await UserEmailConfigApi.update({
        smtp: smtpPassword
          ? {
              smtpEmail,
              smtpPort,
              smtpUsername,
              smtpHost,
              smtpPassword,
            }
          : undefined,
        imap: imapPassword
          ? {
              imapPort,
              imapHost,
              imapUsername,
              imapPassword,
            }
          : undefined,
        imapSyncingInterval,
      });

      toast(createToast(response?.data?.message));
      setIsLoading(false);

      const responseConfig = await UserEmailConfigApi.get();
      setContext('emailConfig', responseConfig.data);

      handleClose();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  const closeFunc = () => {
    if (!isLoading) {
      handleClose();
    }
  };

  useEffect(() => {
    if (store.emailConfig) {
      if (store.emailConfig.smtp) {
        setLocalState('smtpHost', store.emailConfig.smtp.smtpHost);
        setLocalState('smtpEmail', store.emailConfig.smtp.smtpEmail);
        setLocalState('smtpPort', store.emailConfig.smtp.smtpPort);
        setLocalState('smtpUsername', store.emailConfig.smtp.smtpUsername);
        setLocalState('smtpPassword', store.emailConfig.smtp.smtpPassword);
      }
      if (store.emailConfig.imap) {
        setLocalState('imapHost', store.emailConfig.imap.imapHost);
        setLocalState('imapEmail', store.emailConfig.imap.imapEmail);
        setLocalState('imapPort', store.emailConfig.imap.imapPort);
        setLocalState('imapUsername', store.emailConfig.imap.imapUsername);
        setLocalState('imapPassword', store.emailConfig.imap.imapPassword);
      }
    }
  }, []);

  return (
    <ModalNew
      handleClose={closeFunc}
      title={'Add custom email config'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
        <Heading size={'md'}>SMTP</Heading>
        <FormControl>
          <FormLabel htmlFor="smtpHost">Host</FormLabel>
          <ChakraInput
            size={'lg'}
            id="smtpHost"
            name={'smtpHost'}
            onChange={onChange}
            value={smtpHost}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="smtpPort">Port</FormLabel>
          <ChakraInput
            size={'lg'}
            id="smtpPort"
            name={'smtpPort'}
            onChange={onChange}
            value={smtpPort}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="smtpUsername">Username</FormLabel>
          <ChakraInput
            size={'lg'}
            id="smtpUsername"
            name={'smtpUsername'}
            onChange={onChange}
            value={smtpUsername}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="smtpPassword">Password</FormLabel>
          <ChakraInput
            size={'lg'}
            id="smtpPassword"
            name={'smtpPassword'}
            autoComplete={'off'}
            onChange={onChange}
            value={smtpPassword}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="smtpEmail">Email</FormLabel>
          <ChakraInput
            size={'lg'}
            id="smtpEmail"
            name={'smtpEmail'}
            onChange={onChange}
            value={smtpEmail}
          />
        </FormControl>
        <Separator height={25} />
        <Heading size={'md'}>IMAP</Heading>
        <FormControl>
          <FormLabel htmlFor="imapHost">Host</FormLabel>
          <ChakraInput
            size={'lg'}
            id="imapHost"
            name={'imapHost'}
            onChange={onChange}
            value={imapHost}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="imapPort">Port</FormLabel>
          <ChakraInput
            size={'lg'}
            id="imapPort"
            name={'imapPort'}
            onChange={onChange}
            value={imapPort}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="imapUsername">Username</FormLabel>
          <ChakraInput
            size={'lg'}
            id="imapUsername"
            name={'imapUsername'}
            onChange={onChange}
            value={imapUsername}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="imapPassword">Password</FormLabel>
          <ChakraInput
            size={'lg'}
            id="imapPassword"
            name={'imapPassword'}
            autoComplete={'off'}
            onChange={onChange}
            value={imapPassword}
          />
        </FormControl>
        <Separator height={8} />
        <FormControl>
          <FormLabel htmlFor="imapSyncingInterval">
            IMAP syncing interval
          </FormLabel>
          <ChakraInput
            size={'lg'}
            id="imapSyncingInterval"
            name={'imapSyncingInterval'}
            autoComplete={'off'}
            onChange={onChange}
            value={imapSyncingInterval}
          />
        </FormControl>
        <Separator height={25} />
        <Separator height={24} />
        <Center flexDirection={'column'}>
          <PrimaryButton isLoading={isLoading} onClick={handleSave}>
            Save
          </PrimaryButton>
        </Center>
        <Separator height={15} />
      </>
    </ModalNew>
  );
};

export default EmailConfigModal;
