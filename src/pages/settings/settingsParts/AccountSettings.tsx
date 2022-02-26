import { ACCOUNT_TYPE, TOAST_STATUS } from 'types/enums';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Center,
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
} from '../../../types/interface';
import { createToast } from '../../../utils/common';
import {
  deleteCaldavAccount,
  setCaldavCalendars,
  setCaldavEvents,
} from '../../../redux/actions';
import { forEach } from 'lodash';
import { getAccountCalendars } from '../../../utils/tsdavHelper';
import { getBaseUrl } from '../../../utils/parser';
import { useDispatch, useSelector } from 'react-redux';
import AccountSelectionModal from '../../../components/accountSelectionModal/AccountSelectionModal';
import CalDavAccountApi from '../../../api/CalDavAccountApi';
import CalDavAccountModal from '../../../components/calDavAccountModal/CalDavAccountModal';
import React, { useState } from 'react';
import Separator from '../../../components/separator/Separator';

const renderCalDavAccounts = (
  calDavAccounts: CalDavAccount[],
  handleEdit: any,
  openPreDeleteModal: any
) => {
  return calDavAccounts.map((item) => {
    return (
      <Tbody key={item.principalUrl}>
        <Tr>
          <Td>{item.username}</Td>
          <Td>{getBaseUrl(item.principalUrl || '')}</Td>
          <Td>
            <Menu>
              <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
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
  });
};

const AccountSettings = () => {
  const [newAccountModalOpen, openNewAccountModal] =
    useState<ACCOUNT_TYPE | null>(null);

  const [isSelectionModalOpen, openSelectionModal] = useState(false);
  const toast = useToast();

  const handleOpenNewAccountModal = (type: ACCOUNT_TYPE) => {
    openSelectionModal(false);
    openNewAccountModal(type);
  };
  const handleCloseAccountTypeModal = () => {
    openNewAccountModal(null);
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
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

  const calDavAccountsRendered = renderCalDavAccounts(
    calDavAccounts,
    handleEdit,
    openPreDeleteModal
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

  return (
    <>
      <Center>
        <Button
          _focus={{ boxShadow: 'none' }}
          onClick={() => openSelectionModal(true)}
          fontSize={14}
        >
          Add account
        </Button>
      </Center>
      <Separator height={20} />
      <Table variant="simple" size={'md'}>
        <Thead>
          <Tr>
            <Th>Username</Th>
            <Th>Domain</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        {calDavAccountsRendered}
      </Table>
      <AlertDialog
        isOpen={deleteModalVisible}
        onClose={onModalClose}
        leastDestructiveRef={undefined}
        isCentered={true}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to delete your account?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button _focus={{ boxShadow: 'none' }} onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                _focus={{ boxShadow: 'none' }}
                isLoading={isLoading}
                colorScheme="red"
                onClick={handleDeleteAccount}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {editModalVisible ? (
        <CalDavAccountModal
          handleClose={onModalClose}
          account={accountInFocus || undefined}
        />
      ) : null}
      {isSelectionModalOpen ? (
        <AccountSelectionModal
          isOpen={isSelectionModalOpen}
          handleClose={() => openSelectionModal(false)}
          handleOpenNewAccountModal={handleOpenNewAccountModal}
        />
      ) : null}

      {newAccountModalOpen && newAccountModalOpen === ACCOUNT_TYPE.CAL_DAV ? (
        <CalDavAccountModal handleClose={handleCloseAccountTypeModal} />
      ) : null}
    </>
  );
};

export default AccountSettings;
