import { Context, StoreContext } from '../../../context/store';

import { ALERT_BOX_TYPE, CALDAV_COMPONENTS } from '../../../enums';
import {
  Box,
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  ButtonBase,
  PrimaryButton,
  Separator,
  createToastError,
} from 'bloben-components';
import { CalDavCalendar, ReduxState } from '../../../types/interface';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import { getSize } from '../../../types/constants';
import { refreshUserData } from '../../../redux/functions/user';
import { useSelector } from 'react-redux';
import AlertBox from '../../../components/chakraCustom/AlertBox';
import EmailConfigModal from '../../../components/emailConfigModal/EmailConfigModal';
import MobilePageHeader from '../../../components/mobilePageHeader/MobilePageHeader';
import React, { useContext, useEffect, useState } from 'react';
import UserEmailConfigApi from '../../../api/UserEmailConfigApi';

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
  const [modalOpen, openModal] = useState<boolean>(false);

  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [store, dispatchContext]: [StoreContext, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const { emailConfig, isMobile } = store;
  const tableSize = getSize(isMobile);

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

  const setCalendarForImports = async (id: string | null) => {
    try {
      const response = await UserEmailConfigApi.patch({
        calendarForImportID: id,
      });

      toast(createToast(response?.data?.message));

      const responseConfig = await UserEmailConfigApi.get();
      setContext('emailConfig', responseConfig.data);
    } catch (e: any) {
      toast(createToastError(e));
    }
  };

  return (
    <>
      {emailConfig?.hasCustomConfig ? (
        <ButtonBase size={tableSize} onClick={() => openModal(true)}>
          View config
        </ButtonBase>
      ) : null}

      <Separator width={16} height={16} />
      <Flex direction={'row'} alignItems={'center'}>
        <Text>Automatic importing events to </Text>
        <Separator width={12} />
        <Menu>
          <MenuButton
            as={Button}
            _focus={{ boxShadow: 'none' }}
            size={tableSize}
          >
            {emailConfig.calendarForImportID
              ? calDavCalendars.find(
                  (item) => item.id === emailConfig.calendarForImportID
                )?.displayName
              : 'Disabled'}
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => setCalendarForImports(null)}>
              Disable
            </MenuItem>
            {calDavCalendars
              .filter((item) =>
                item.components.includes(CALDAV_COMPONENTS.VEVENT)
              )
              .map((item) => {
                return (
                  <MenuItem
                    key={item.id}
                    onClick={() => setCalendarForImports(item.id)}
                  >
                    {item.displayName}
                  </MenuItem>
                );
              })}
          </MenuList>
        </Menu>
      </Flex>
      <Separator width={16} height={16} />

      {emailConfig?.hasCustomConfig ? (
        <>
          <ButtonBase
            size={tableSize}
            isLoading={isLoading}
            onClick={handleDelete}
          >
            Delete config
          </ButtonBase>
        </>
      ) : null}

      {modalOpen ? (
        <EmailConfigModal handleClose={() => openModal(false)} />
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

        {emailConfig?.hasCustomConfig ? (
          <AlertBox
            type={ALERT_BOX_TYPE.SUCCESS}
            title={'Using custom email config'}
            description={
              'You will be able to send invites or import events from email' +
              ' under account ' +
              emailConfig?.imap?.imapUsername +
              '.'
            }
          />
        ) : null}
        <Separator height={24} />

        {!emailConfig?.hasCustomConfig ? (
          <NoCustomEmailConfig />
        ) : (
          <CustomEmailConfig />
        )}

        <Separator height={24} />
      </Box>
    </>
  );
};

export default EmailConfigSettings;
