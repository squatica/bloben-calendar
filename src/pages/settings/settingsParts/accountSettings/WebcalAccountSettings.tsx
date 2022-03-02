import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import { ReduxState } from '../../../../types/interface';
import { TOAST_STATUS } from 'types/enums';
import { WebcalCalendar } from '../../../../redux/reducers/webcalCalendars';
import { createToast } from '../../../../utils/common';
import { setWebcalCalendars } from '../../../../redux/actions';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import Separator from '../../../../components/separator/Separator';
import WebcalCalendarApi from '../../../../api/WebcalCalendarApi';

const renderWebcalCalendars = (
  webcalCalendars: WebcalCalendar[],
  openPreDeleteModal: any
) => {
  return webcalCalendars.map((item) => {
    return (
      <Tbody key={item.url}>
        <Tr>
          <Td>{item.name}</Td>
          <Td>{item.url.slice(0, 35)}</Td>
          <Td>
            <Menu>
              <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
                Actions
              </MenuButton>
              <MenuList>
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

const CalDavAccountSettings = () => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [webcalInFocus, setWebcalInFocus] = useState<WebcalCalendar | null>(
    null
  );
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const dispatch = useDispatch();

  const webcalCalendars: WebcalCalendar[] = useSelector(
    (state: ReduxState) => state.webcalCalendars
  );

  const openPreDeleteModal = (item: WebcalCalendar) => {
    setWebcalInFocus(item);
    setDeleteModalVisible(true);
  };
  const onModalClose = () => {
    if (isLoading) {
      return;
    }
    setWebcalInFocus(null);
    setDeleteModalVisible(false);
  };

  const webcalCalendarsRendered = renderWebcalCalendars(
    webcalCalendars,
    openPreDeleteModal
  );

  const handleDelete = async () => {
    try {
      if (!webcalInFocus) {
        return;
      }
      setIsLoading(true);

      const response: any = await WebcalCalendarApi.deleteWebcalCalendar(
        webcalInFocus.id
      );

      if (response.status === 200) {
        const response = await WebcalCalendarApi.getWebcalCalendars();

        dispatch(setWebcalCalendars(response.data));

        toast(createToast('Webcal calendar deleted'));
        setWebcalInFocus(null);
        setDeleteModalVisible(false);
        setIsLoading(false);
      }
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
      setIsLoading(false);
    }
  };

  return webcalCalendars.length ? (
    <>
      <Heading size={'md'} paddingLeft={6}>
        Webcal
      </Heading>
      <Separator height={8} />

      <Table variant="simple" size={'md'}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Url</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        {webcalCalendarsRendered}
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
              Delete Webcal calendar
            </AlertDialogHeader>

            <AlertDialogBody>
              Do you want to delete webcal calendar?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button _focus={{ boxShadow: 'none' }} onClick={onModalClose}>
                Cancel
              </Button>
              <Button
                _focus={{ boxShadow: 'none' }}
                isLoading={isLoading}
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  ) : null;
};

export default CalDavAccountSettings;
