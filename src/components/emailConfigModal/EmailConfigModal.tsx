import {
  Center,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react';
import { Context } from '../../context/store';
import { TOAST_STATUS } from '../../types/enums';
import {
  UpdateUserEmailConfigRequest,
  UserEmailConfigData,
} from '../../bloben-interface/userEmailConfig/userEmailConfig';
import { createToast } from '../../utils/common';
import ModalNew from 'components/modalNew/ModalNew';
import PrimaryButton from '../chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useReducer, useState } from 'react';
import Separator from '../separator/Separator';
import StateReducer from '../../utils/state-reducer';
import UserEmailConfigApi from '../../api/UserEmailConfigApi';

interface EmailConfigModalProps {
  handleClose: any;
}
const initialState: UserEmailConfigData = {
  smtpEmail: '',
  smtpPort: 587,
  smtpUsername: '',
  smtpHost: '',
  smtpPassword: '',
};

const EmailConfigModal = (props: EmailConfigModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, dispatchContext] = useContext(Context);
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

  const { smtpHost, smtpPort, smtpPassword, smtpUsername, smtpEmail } =
    state as UserEmailConfigData;

  const onChange = (e: any): void => {
    const name = e.target.name;
    const value = e.target.value;

    setLocalState(name, value);
  };

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

  return (
    <ModalNew
      handleClose={closeFunc}
      title={'Add custom email config'}
      closeButton={true}
      preventCloseOnBackdrop={true}
    >
      <>
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
            autoComplete={'off'}
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
