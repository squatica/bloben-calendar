import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Context, StoreContext } from '../../../../context/store';
import { EmailConfigData } from 'bloben-interface';
import { TOAST_STATUS } from '../../../../types/enums';
import { createToast } from '../../../../utils/common';
import { getSize } from '../../../../types/constants';
import EmailConfigModal from './EmailConfigModal';
import React, { useContext, useState } from 'react';
import UserEmailConfigApi from '../../../../api/UserEmailConfigApi';

const parseHost = (config: EmailConfigData) => {
  const { imap, smtp } = config;
  if (smtp?.smtpHost) {
    if (smtp?.smtpHost.slice(0, 5) === 'smtp.') {
      return smtp?.smtpHost.slice(5);
    }
  }

  if (imap?.imapHost) {
    if (imap?.imapHost.slice(0, 5) === 'imap.') {
      return imap?.imapHost.slice(5);
    }
  }

  return smtp?.smtpHost || imap?.imapHost;
};

const parseName = (config: EmailConfigData) => {
  if (config.smtp?.smtpUsername) {
    if (config.smtp.smtpUsername.length >= 9) {
      return `${config.smtp.smtpUsername.slice(0, 7)}...`;
    }

    return config.smtp.smtpUsername;
  }

  if (config.imap?.imapUsername) {
    if (config.imap.imapUsername.length >= 9) {
      return `${config.imap.imapUsername.slice(0, 7)}...`;
    }

    return config.imap.imapUsername;
  }

  return '';
};

const EmailConfigsTable = () => {
  const toast = useToast();

  const [store, dispatchContext]: [StoreContext, any] = useContext(Context);
  const setContext = (type: string, payload: any) => {
    dispatchContext({ type, payload });
  };

  const { emailConfig, isMobile } = store;
  const tableSize = getSize(isMobile);

  const [modalOpen, openModal] = useState<EmailConfigData | null>(null);

  const handleDelete = async (config: EmailConfigData) => {
    try {
      const response = await UserEmailConfigApi.delete(config.id);

      toast(createToast(response?.data?.message));

      const responseGet = await UserEmailConfigApi.get();

      setContext('emailConfig', responseGet.data);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const makeDefault = async (id: string) => {
    try {
      const response = await UserEmailConfigApi.patch({ isDefault: true }, id);

      toast(createToast(response?.data?.message));

      const responseGet = await UserEmailConfigApi.get();

      setContext('emailConfig', responseGet.data);
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const paddingSmall = 2;

  return (
    <Table variant="simple" size={tableSize}>
      <Thead>
        <Tr>
          <Th>Host</Th>
          <Th>Username</Th>
          <Th paddingLeft={paddingSmall} paddingRight={paddingSmall}>
            Default
          </Th>
          <Th paddingLeft={paddingSmall} paddingRight={paddingSmall}>
            Imap
          </Th>
          <Th paddingLeft={paddingSmall} paddingRight={paddingSmall}>
            Smtp
          </Th>
          <Th>Action</Th>
        </Tr>
      </Thead>
      {emailConfig?.configs?.map((config) => {
        return (
          <Tbody key={config.id}>
            <Tr>
              <Td>{parseHost(config)}</Td>
              <Td>{parseName(config)}</Td>
              <Td paddingLeft={paddingSmall} paddingRight={paddingSmall}>
                {config.isDefault ? 'X' : ''}
              </Td>
              <Td paddingLeft={paddingSmall} paddingRight={paddingSmall}>
                {config.smtp ? 'X' : ''}
              </Td>
              <Td paddingLeft={paddingSmall} paddingRight={paddingSmall}>
                {config.imap ? 'X' : ''}
              </Td>
              <Td>
                <Menu>
                  <MenuButton
                    as={Button}
                    _focus={{ boxShadow: 'none' }}
                    size={'xs'}
                  >
                    Action
                  </MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => openModal(config)}>Edit</MenuItem>
                    {!config.isDefault ? (
                      <MenuItem onClick={() => makeDefault(config.id)}>
                        Make default
                      </MenuItem>
                    ) : null}
                    <MenuItem onClick={() => handleDelete(config)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        );
      })}
      {modalOpen ? (
        <EmailConfigModal
          config={modalOpen}
          handleClose={() => openModal(null)}
        />
      ) : null}
    </Table>
  );
};

export default EmailConfigsTable;
