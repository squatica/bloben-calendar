import { Context } from '../../../context/store';

import { Heading, useToast } from '@chakra-ui/react';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import ButtonBase from 'components/chakraCustom/buttonBase/ButtonBase';
import EmailConfigModal from '../../../components/emailConfigModal/EmailConfigModal';
import React, { useContext, useState } from 'react';
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

  return (
    <>
      <Separator height={24} />
      {!emailConfig.hasSystemConfig && !emailConfig.hasCustomConfig ? (
        <Heading size={'md'}>No email config</Heading>
      ) : null}
      {emailConfig.hasSystemConfig && !emailConfig.hasCustomConfig ? (
        <Heading size={'md'}>Using system config</Heading>
      ) : null}
      {emailConfig.hasCustomConfig ? (
        <Heading size={'md'}>Using custom config</Heading>
      ) : null}
      <Separator height={24} />
      <Separator height={24} />

      {!emailConfig.hasCustomConfig ? (
        <ButtonBase onClick={() => openModal(true)}>
          Add custom config
        </ButtonBase>
      ) : null}

      {modalOpen ? (
        <EmailConfigModal handleClose={() => openModal(false)} />
      ) : null}

      {emailConfig.hasCustomConfig ? (
        <>
          <ButtonBase isLoading={isLoading} onClick={handleDelete}>
            Delete config
          </ButtonBase>
        </>
      ) : null}
    </>
  );
};

export default EmailConfigSettings;
