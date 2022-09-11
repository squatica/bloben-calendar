import { Box, Button, useToast } from '@chakra-ui/react';
import { Context, StoreContext } from '../../../context/store';
import { ReduxState } from '../../../types/interface';

import { getSize } from '../../../types/constants';

import { Alert, SettingsRow } from 'bloben-components';
import { refreshUserData } from '../../../redux/functions/user';
import { useSelector } from 'react-redux';
import MobilePageHeader from '../../../components/mobilePageHeader/MobilePageHeader';
import React, { useContext, useState } from 'react';
import TwoFactorAuthApi from '../../../api/TwoFactorAuth.api';
import TwoFactorSetup from '../../../components/2FA/TwoFactorSetup';

const menuStyle: any = {
  width: '100%',
  justifyContent: 'flex-start',
  textAlign: 'left',
};

const SecuritySettings = () => {
  const toast = useToast();
  const [store]: [StoreContext] = useContext(Context);

  const { isMobile } = store;

  const user = useSelector((state: ReduxState) => state.user);
  const tableSize = getSize(isMobile);

  const [twoFactorModalOpen, openTwoFactorModal] = useState(false);
  const [deleteModalVisible, openDeleteModal] = useState(false);

  const handleDisable2FA = async () => {
    try {
      const response = await TwoFactorAuthApi.delete2FA();

      toast({
        title: response?.data?.message,
      });

      openDeleteModal(false);

      await refreshUserData();
    } catch (e: any) {
      if (e.response?.data?.message) {
        toast({
          title: e.response?.data?.message,
          status: 'error',
        });
      }
    }
  };

  return (
    <>
      {isMobile ? <MobilePageHeader title={'General settings'} /> : null}
      <Box style={{ padding: isMobile ? 12 : 0 }}>
        <SettingsRow title={'Two factor authentication'}>
          <Button
            style={menuStyle}
            _focus={{ boxShadow: 'none' }}
            size={tableSize}
            onClick={
              user.isTwoFactorEnabled
                ? () => openDeleteModal(true)
                : () => openTwoFactorModal(true)
            }
          >
            {user.isTwoFactorEnabled ? 'Disable' : 'Enable'}
          </Button>
        </SettingsRow>
      </Box>
      {twoFactorModalOpen ? (
        <TwoFactorSetup handleClose={() => openTwoFactorModal(false)} />
      ) : null}

      <Alert
        isOpen={deleteModalVisible}
        onClose={() => openDeleteModal(false)}
        header={'Two factor authentication'}
        body={' Do you want to disable two factor authentication?'}
        submitText={'Disable'}
        onSubmit={handleDisable2FA}
      />
    </>
  );
};

export default SecuritySettings;
