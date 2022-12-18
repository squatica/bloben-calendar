import { Context, StoreContext } from '../../../../context/store';

import { ALERT_BOX_TYPE } from '../../../../enums';
import { Box, Heading, useToast } from '@chakra-ui/react';
import {
  ButtonBase,
  PrimaryButton,
  Separator,
  createToastError,
} from 'bloben-components';
import { createToast } from '../../../../utils/common';
import { getSize } from '../../../../types/constants';
import { refreshUserData } from '../../../../redux/functions/user';
import AlertBox from '../../../../components/chakraCustom/AlertBox';
import EmailConfigModal from './EmailConfigModal';
import EmailConfigsTable from './EmailConfigTable';
import GeneralApi from '../../../../api/GeneralApi';
import MobilePageHeader from '../../../../components/mobilePageHeader/MobilePageHeader';
import React, { useContext, useEffect, useState } from 'react';

const NoCustomEmailConfig = () => {
  const [store]: [StoreContext] = useContext(Context);
  const { isMobile } = store;

  const [modalOpen, openModal] = useState<boolean>(false);
  const tableSize = getSize(isMobile);

  return (
    <>
      <PrimaryButton
        size={tableSize}
        isSecondary
        onClick={() => openModal(true)}
      >
        Add custom config
      </PrimaryButton>
      {modalOpen ? (
        <EmailConfigModal handleClose={() => openModal(false)} />
      ) : null}
    </>
  );
};

const CustomEmailConfig = () => {
  const toast = useToast();
  const [isLoading] = useState(false);
  const [store]: [StoreContext] = useContext(Context);

  const { emailConfig, isMobile } = store;
  const tableSize = getSize(isMobile);

  const syncEmails = async () => {
    try {
      const response = await GeneralApi.syncEmails();

      toast(createToast(response?.data?.message));
    } catch (e: any) {
      toast(createToastError(e));
    }
  };

  return (
    <>
      <Separator width={16} height={16} />

      <Separator width={16} height={16} />

      {emailConfig?.hasCustomConfig ? <EmailConfigsTable /> : null}

      {emailConfig?.hasCustomConfig ? (
        <>
          <Separator width={16} height={16} />
          <ButtonBase
            size={tableSize}
            isLoading={isLoading}
            onClick={syncEmails}
          >
            Sync emails
          </ButtonBase>
        </>
      ) : null}
    </>
  );
};

const EmailConfigSettings = () => {
  const [store]: [StoreContext] = useContext(Context);

  const { emailConfig, isMobile } = store;
  const tableSize = getSize(isMobile);

  useEffect(() => {
    refreshUserData();
  }, []);

  return (
    <>
      {isMobile ? <MobilePageHeader title={'Email config'} /> : null}
      <Box style={{ padding: isMobile ? 12 : 0 }}>
        <Heading size={tableSize}>SMTP email config</Heading>
        <Separator height={24} />

        {!emailConfig?.hasSystemConfig && !emailConfig?.hasCustomConfig ? (
          <AlertBox
            type={ALERT_BOX_TYPE.ERROR}
            title={'No server or user email config found'}
            description={
              'Email functions like invites or importing events will not work.'
            }
          />
        ) : null}

        {emailConfig?.hasSystemConfig && !emailConfig?.hasCustomConfig ? (
          <AlertBox
            type={ALERT_BOX_TYPE.INFO}
            title={'Using global server email config'}
            description={
              'Sending invites will work. For importing events' +
              ' from email, add custom user email config.'
            }
          />
        ) : null}

        {emailConfig.hasCustomConfig ? (
          <AlertBox
            type={ALERT_BOX_TYPE.SUCCESS}
            title={'Using custom email config'}
            description={
              'You will be able to send invites or import events from your email' +
              ' under account.'
            }
          />
        ) : null}
        <Separator height={24} />

        <NoCustomEmailConfig />
        <CustomEmailConfig />

        <Separator height={24} />
      </Box>
    </>
  );
};

export default EmailConfigSettings;
