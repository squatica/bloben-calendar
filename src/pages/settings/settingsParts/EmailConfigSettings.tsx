import { Context } from '../../../context/store';

import {
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';
import {
  UpdateUserEmailConfigRequest,
  UserEmailConfigData,
} from '../../../bloben-interface/userEmailConfig/userEmailConfig';
import { createToast } from '../../../utils/common';
import ButtonBase from 'components/chakraCustom/buttonBase/ButtonBase';
import PrimaryButton from '../../../components/chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Separator from '../../../components/separator/Separator';
import StateReducer from '../../../utils/state-reducer';
import UserEmailConfigApi from '../../../api/UserEmailConfigApi';

const initialState: UserEmailConfigData = {
  smtpEmail: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpHost: '',
  smtpPassword: '',
};

const EmailConfigSettings = () => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const { emailConfig } = store;

  const [state, dispatchState] = useReducer(StateReducer, initialState);
  const setLocalState = (stateName: string, data: any): void => {
    const payload: any = { stateName, type: 'simple', data };
    // @ts-ignore
    dispatchState({ state, payload });
  };

  const { smtpHost, smtpPort, smtpPassword, smtpUsername, smtpEmail } =
    state as UserEmailConfigData;

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;

    setLocalState(name, value);
  };

  useEffect(() => {
    if (emailConfig) {
      setLocalState('smtpHost', emailConfig.smtpHost);
      setLocalState('smtpPort', emailConfig.smtpPort);
      setLocalState('smtpUsername', emailConfig.smtpUsername);
      setLocalState('smtpPassword', emailConfig.smtpPassword);
      setLocalState('smtpEmail', emailConfig.smtpEmail);
    }
  }, []);
  useEffect(() => {
    if (emailConfig) {
      setLocalState('smtpHost', emailConfig.smtpHost);
      setLocalState('smtpPort', emailConfig.smtpPort);
      setLocalState('smtpUsername', emailConfig.smtpUsername);
      setLocalState('smtpPassword', emailConfig.smtpPassword);
      setLocalState('smtpEmail', emailConfig.smtpEmail);
    }
  }, [JSON.stringify(emailConfig), emailConfig]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await UserEmailConfigApi.update(
        state as UpdateUserEmailConfigRequest
      );

      toast(createToast(response?.data?.message));
      setIsLoading(false);

      const responseConfig = await UserEmailConfigApi.get();
      setContext('emailConfig', responseConfig.data);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await UserEmailConfigApi.delete();

      toast(createToast(response?.data?.message));
      setIsLoading(false);

      setContext('emailConfig', null);
      setLocalState('smtpHost', '');
      setLocalState('smtpPort', 587);
      setLocalState('smtpUsername', '');
      setLocalState('smtpPassword', '');
      setLocalState('smtpEmail', '');
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return (
    <>
      {emailConfig ? null : <Text>No email config</Text>}
      {emailConfig?.isSystemConfig ? <Text>System config</Text> : null}
      <Separator height={16} />
      <FormControl>
        <FormLabel htmlFor="smtpHost">Host</FormLabel>
        <Input
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
        <Input
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
        <Input
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
        <Input
          size={'lg'}
          id="smtpPassword"
          name={'smtpPassword'}
          onChange={onChange}
          value={smtpPassword}
        />
      </FormControl>
      <Separator height={8} />
      <FormControl>
        <FormLabel htmlFor="smtpEmail">Email</FormLabel>
        <Input
          size={'lg'}
          id="smtpEmail"
          name={'smtpEmail'}
          onChange={onChange}
          value={smtpEmail}
        />
      </FormControl>
      <Separator height={24} />
      <Center flexDirection={'column'}>
        <PrimaryButton isLoading={isLoading} onClick={handleSave}>
          Save
        </PrimaryButton>
      </Center>
      {emailConfig?.isSystemConfig === false ? (
        <>
          <Separator height={24} />
          <Center flexDirection={'column'}>
            <ButtonBase isLoading={isLoading} onClick={handleDelete}>
              Delete config
            </ButtonBase>
          </Center>
        </>
      ) : null}
    </>
  );
};

export default EmailConfigSettings;
