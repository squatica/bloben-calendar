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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
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
import { useSelector } from 'react-redux';

import React, { useState } from 'react';
import Separator from '../../../../components/separator/Separator';
import WebcalCalendarApi from '../../../../api/WebcalCalendarApi';
import WebcalModal from '../../../../components/accountSelectionModal/webcalModal/WebcalModal';

const renderWebcalCalendars = (
  webcalCalendars: WebcalCalendar[],
  handleEdit: any,
  handleHide: any,
  openPreDeleteModal: any
) => {
  return webcalCalendars.map((item) => {
    return (
      <Tbody key={item.url}>
        <Tr>
          <Td>
            {item.name} {item.isHidden ? '(hidden)' : ''}
          </Td>
          <Td>
            <Popover>
              {/*// @ts-ignore*/}
              <PopoverTrigger>
                <Button>Show url</Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody>{item.url}</PopoverBody>
              </PopoverContent>
            </Popover>
          </Td>
          <Td>
            <Menu>
              <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
                Actions
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => handleHide(item)}>
                  {item.isHidden ? 'Show' : 'Hide'}
                </MenuItem>
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

const CalDavAccountSettings = () => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [webcalInFocus, setWebcalInFocus] = useState<WebcalCalendar | null>(
    null
  );
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

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
    setEditModalVisible(false);
    setDeleteModalVisible(false);
  };

  const handleHide = async (item: WebcalCalendar) => {
    await WebcalCalendarApi.patchCalendar(item.id, {
      isHidden: !item.isHidden,
    });
  };

  const handleEdit = (item: WebcalCalendar) => {
    setWebcalInFocus(item);
    setEditModalVisible(true);
  };

  const webcalCalendarsRendered = renderWebcalCalendars(
    webcalCalendars,
    handleEdit,
    handleHide,
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
      {editModalVisible ? (
        <WebcalModal
          handleClose={onModalClose}
          webcalCalendar={webcalInFocus || undefined}
        />
      ) : null}
    </>
  ) : null;
};

export default CalDavAccountSettings;
