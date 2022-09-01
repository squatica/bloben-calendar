import { Alert, Separator } from 'bloben-components';
import {
  Button,
  Heading,
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
import {
  CalDavAccount,
  CalDavCalendar,
  CalDavEvent,
  ReduxState,
} from '../../../../types/interface';
import { Context, StoreContext } from '../../../../context/store';
import { DAV_ACCOUNT_TYPE } from '../../../../enums';
import { TOAST_STATUS } from '../../../../types/enums';
import { createToast } from '../../../../utils/common';
import {
  deleteCaldavAccount,
  setCaldavCalendars,
  setCaldavEvents,
} from '../../../../redux/actions';
import { filter, forEach } from 'lodash';
import { getAccountCalendars } from '../../../../utils/tsdavHelper';
import { getBaseUrl } from '../../../../utils/parser';
import {
  getSize,
  getTableSize,
  getTableTitlePaddingLeft,
} from '../../../../types/constants';
import { useDispatch, useSelector } from 'react-redux';
import CalDavAccountApi from '../../../../api/CalDavAccountApi';
import CalDavAccountModal from '../../../../components/accountSelectionModal/calDavAccountModal/CalDavAccountModal';
import React, { useContext, useState } from 'react';

const renderCalDavAccounts = (
  calDavAccounts: CalDavAccount[],
  handleEdit: any,
  openPreDeleteModal: any,
  type: DAV_ACCOUNT_TYPE,
  isMobile: boolean
) => {
  const size = getTableSize(isMobile);
  return filter(calDavAccounts, (item) => item.accountType === type).map(
    (item) => {
      return (
        <Tbody key={item.principalUrl}>
          <Tr>
            <Td>{item.username}</Td>
            {!isMobile ? <Td>{getBaseUrl(item.principalUrl || '')}</Td> : null}
            <Td>
              <Menu>
                <MenuButton
                  as={Button}
                  _focus={{ boxShadow: 'none' }}
                  size={size}
                >
                  Actions
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleEdit(item)}>Edit</MenuItem>
                  <MenuItem onClick={() => openPreDeleteModal(item)}>
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        </Tbody>
      );
    }
  );
};

const CalDavAccountSettings = () => {
  const [store]: [StoreContext] = useContext(Context);
  const { isMobile } = store;

  const [editModalVisible, setEditModalVisible] = useState(false);

  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [accountInFocus, setAccountInFocus] = useState<CalDavAccount | null>(
    null
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dispatch = useDispatch();
  const calDavAccounts: CalDavAccount[] = useSelector(
    (state: ReduxState) => state.calDavAccounts
  );
  const calDavCalendars: CalDavCalendar[] = useSelector(
    (state: ReduxState) => state.calDavCalendars
  );

  const calDavEvents: CalDavEvent[] = useSelector(
    (state: ReduxState) => state.calDavEvents
  );

  const handleEdit = (item: CalDavAccount) => {
    setEditModalVisible(true);
    setAccountInFocus(item);
  };

  const openPreDeleteModal = (item: CalDavAccount) => {
    setAccountInFocus(item);
    setDeleteModalVisible(true);
  };
  const onModalClose = () => {
    if (isLoading) {
      return;
    }
    setAccountInFocus(null);
    setDeleteModalVisible(false);
    setEditModalVisible(false);
  };

  const tableSize = getSize(isMobile);
  const paddingLeft = getTableTitlePaddingLeft(isMobile);

  const calDavAccountsRendered = renderCalDavAccounts(
    calDavAccounts,
    handleEdit,
    openPreDeleteModal,
    DAV_ACCOUNT_TYPE.CALDAV,
    isMobile
  );

  const cardDavAccountsRendered = renderCalDavAccounts(
    calDavAccounts,
    handleEdit,
    openPreDeleteModal,
    DAV_ACCOUNT_TYPE.CARDDAV,
    isMobile
  );

  const handleDeleteAccount = async () => {
    try {
      if (!accountInFocus) {
        return;
      }
      setIsLoading(true);

      const response: any = await CalDavAccountApi.deleteCalDavAccount(
        accountInFocus.id
      );

      if (response.status === 200) {
        const accountCalendars = getAccountCalendars(
          accountInFocus,
          calDavCalendars
        );

        let events = [...calDavEvents];

        // delete events
        forEach(accountCalendars, (calendar) => {
          events = events.filter((item) => item.calendarID !== calendar.id);
        });

        dispatch(setCaldavEvents(events));

        // delete calendars
        let calendars = [...calDavCalendars];
        calendars = calendars.filter(
          (item) => item.calDavAccountID !== accountInFocus.id
        );
        dispatch(setCaldavCalendars(calendars));

        // delete account
        dispatch(deleteCaldavAccount(accountInFocus));

        toast(createToast('CalDav account deleted'));
        setAccountInFocus(null);
        setDeleteModalVisible(false);
        setIsLoading(false);
      }
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return calDavAccounts.length ? (
    <>
      {calDavAccountsRendered.length ? (
        <>
          <Heading size={'md'} paddingLeft={paddingLeft}>
            CalDAV
          </Heading>
          <Separator height={8} />
          <Table variant="simple" size={tableSize}>
            <Thead>
              <Tr>
                <Th>Username</Th>
                {!isMobile ? <Th>Domain</Th> : null}
                <Th>Action</Th>
              </Tr>
            </Thead>
            {calDavAccountsRendered}
          </Table>
          <Separator height={24} />
        </>
      ) : null}
      {cardDavAccountsRendered.length ? (
        <>
          <Heading size={'md'} paddingLeft={paddingLeft}>
            CardDAV
          </Heading>
          <Separator height={8} />
          <Table variant="simple" size={tableSize}>
            <Thead>
              <Tr>
                <Th>Username</Th>
                {!isMobile ? <Th>Domain</Th> : null}
                <Th>Action</Th>
              </Tr>
            </Thead>
            {cardDavAccountsRendered}
          </Table>
        </>
      ) : null}

      <Alert
        isOpen={deleteModalVisible}
        onClose={onModalClose}
        header={'Delete Account'}
        body={'Do you want to delete your account?'}
        submitText={'Delete'}
        onSubmit={handleDeleteAccount}
      />

      {editModalVisible ? (
        <CalDavAccountModal
          handleClose={onModalClose}
          account={accountInFocus || undefined}
        />
      ) : null}
    </>
  ) : null;
};

export default CalDavAccountSettings;
