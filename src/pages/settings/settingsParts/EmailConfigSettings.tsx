import { Context } from '../../../context/store';

import { Heading, Text, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import { refreshUserData } from '../../../redux/functions/user';
import ButtonBase from 'components/chakraCustom/buttonBase/ButtonBase';
import EmailConfigModal from '../../../components/emailConfigModal/EmailConfigModal';
import PrimaryButton from '../../../components/chakraCustom/primaryButton/PrimaryButton';
import React, { useContext, useEffect, useState } from 'react';
import Separator from '../../../components/separator/Separator';
import UserEmailConfigApi from '../../../api/UserEmailConfigApi';

const EmailConfigSettings = () => {
  const [modalOpen, openModal] = useState<boolean>(false);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [store, dispatchContext] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const { emailConfig } = store;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await UserEmailConfigApi.delete();

      toast(createToast(response?.data?.message));

      const responseGet = await UserEmailConfigApi.get();

      setContext('emailConfig', responseGet.data);

      setIsLoading(false);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <>
      <Heading size={'md'}>SMTP config for invites</Heading>
      <Separator height={24} />
      {!emailConfig?.hasSystemConfig && !emailConfig?.hasCustomConfig ? (
        <Text size={'md'}>No email config</Text>
      ) : null}
      {emailConfig?.hasSystemConfig && !emailConfig?.hasCustomConfig ? (
        <Text size={'md'}>Using system config</Text>
      ) : null}
      {emailConfig?.hasCustomConfig ? (
        <Text size={'md'}>Using custom config</Text>
      ) : null}
      <Separator height={24} />

      {!emailConfig?.hasCustomConfig ? (
        <PrimaryButton isSecondary onClick={() => openModal(true)}>
          Add custom config
        </PrimaryButton>
      ) : null}

      {modalOpen ? (
        <EmailConfigModal handleClose={() => openModal(false)} />
      ) : null}

      {emailConfig?.hasCustomConfig ? (
        <>
          <ButtonBase isLoading={isLoading} onClick={handleDelete}>
            Delete config
          </ButtonBase>
        </>
      ) : null}
      <Separator height={24} />
    </>
  );
};

export default EmailConfigSettings;
