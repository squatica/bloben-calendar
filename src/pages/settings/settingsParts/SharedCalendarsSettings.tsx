import {
  Button,
  Center,
  Checkbox,
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
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { Context } from '../../../context/store';
import { GetSharedCalendarsResponse } from '../../../bloben-interface/calendar/shared/calendarShared';
import { TOAST_STATUS } from '../../../types/enums';
import { createToast } from '../../../utils/common';
import CalendarSharedApi from '../../../api/CalendarSharedApi';
import EmailModal from '../../../components/emailModal/EmailModal';
import React, { useContext, useEffect, useState } from 'react';
import Separator from '../../../components/separator/Separator';
import ShareCalendarModal from '../../../components/shareCalendarsModal/ShareCalendarModal';

const formatSharableLink = (id: string) => `${window.location}/public/${id}`;

const SharedCalendarItem = (props: {
  item: GetSharedCalendarsResponse;
  handleDelete: any;
  handleEdit: any;
  handleEnable: any;
  openInviteModal?: any;
}) => {
  return (
    <Tbody>
      <Tr>
        <Td>{props.item.name}</Td>
        <Td>
          <Button
            onClick={() => props.handleEnable(props.item.id)}
            style={{ background: 'transparent' }}
          >
            <Checkbox
              onChange={() => props.handleEnable(props.item.id)}
              isChecked={props.item.isEnabled}
              disabled={false}
            />
          </Button>
        </Td>
        <Td>
          <Popover>
            {/*// @ts-ignore*/}
            <PopoverTrigger>
              <Button>Show url</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody>{formatSharableLink(props.item.id)}</PopoverBody>
            </PopoverContent>
          </Popover>
        </Td>
        <Td></Td>
        <Td>
          <Menu closeOnSelect={false}>
            <MenuButton as={Button} _focus={{ boxShadow: 'none' }}>
              Action
            </MenuButton>
            <MenuList>
              <Stack spacing={1}>
                <MenuItem onClick={() => props.handleEdit(props.item.id)}>
                  Edit
                </MenuItem>
                {props.openInviteModal ? (
                  <MenuItem
                    onClick={() => props.openInviteModal(props.item.id)}
                  >
                    Invite by email
                  </MenuItem>
                ) : null}
                <MenuItem onClick={() => props.handleDelete(props.item.id)}>
                  Delete
                </MenuItem>
              </Stack>
            </MenuList>
          </Menu>
        </Td>
        <Td></Td>
      </Tr>
    </Tbody>
  );
};

const SharedCalendarsSettings = () => {
  const [store] = useContext(Context);
  const toast = useToast();

  const [modalOpen, openModal] = useState<boolean>(false);
  const [editModalOpen, openEditModal] = useState<null | string>(null);

  const [inviteModalText, setInviteModalText] = useState('');
  const [inviteModalOpen, openInviteModal] = useState<null | string>(null);

  const hasEmailSet =
    store?.emailConfig?.hasSystemConfig || store?.emailConfig?.hasCustomConfig;

  const [data, setData] = useState<GetSharedCalendarsResponse[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [store, dispatchContext] = useContext(Context);
  // const setContext = (type: string, payload: any) => {
  //   dispatchContext({ type, payload });
  // };

  const loadSharedCalendars = async () => {
    const response = await CalendarSharedApi.getSharedCalendars();

    if (response.data) {
      setData(response.data);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleDelete = async (id: string) => {
    try {
      const response = await CalendarSharedApi.deleteSharedCalendar(id);

      if (response.status === 200) {
        toast(createToast(response.data.message));
      }

      await loadSharedCalendars();
    } catch (e: any) {
      toast(createToast(e.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  const handleEnable = async (id: string) => {
    await CalendarSharedApi.patchSharedCalendar(id);

    await loadSharedCalendars();
  };

  useEffect(() => {
    loadSharedCalendars();
  }, []);

  const handleOpenInviteModal = (id: string) => {
    openInviteModal(id);
    setInviteModalText(
      `You have been invited to view calendar \n\n ${formatSharableLink(
        id
      )} \n\n`
    );
  };

  const handleCloseInviteModal = () => {
    openInviteModal(null);
    setInviteModalText('');
  };

  const handleSendEmailInvite = async (text: string, recipients: string[]) => {
    try {
      const response = await CalendarSharedApi.postInvite({
        emailBody: text,
        recipients,
      });

      if (response.status === 200) {
        toast(createToast(response.data.message));

        openInviteModal(null);
        setInviteModalText('');
      }
    } catch (err: any) {
      toast(createToast(err.response?.data?.message, TOAST_STATUS.ERROR));
    }
  };

  return (
    <>
      <Heading size={'md'}>Shared calendars</Heading>
      <Center>
        <Button
          _focus={{ boxShadow: 'none' }}
          onClick={() => openModal(true)}
          fontSize={14}
        >
          Share
        </Button>
      </Center>
      <Separator height={20} />
      <Table variant="simple" size={'md'}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Enabled</Th>
            <Th>Link</Th>
            <Th></Th>
          </Tr>
        </Thead>
        {data.map((item) => (
          <SharedCalendarItem
            key={item.id}
            item={item}
            handleDelete={handleDelete}
            handleEdit={openEditModal}
            handleEnable={handleEnable}
            openInviteModal={hasEmailSet ? handleOpenInviteModal : undefined}
          />
        ))}
      </Table>

      <Separator height={24} />
      {modalOpen ? (
        <ShareCalendarModal
          handleClose={() => openModal(false)}
          loadSharedCalendars={loadSharedCalendars}
        />
      ) : null}
      {editModalOpen ? (
        <ShareCalendarModal
          handleClose={() => openEditModal(null)}
          loadSharedCalendars={loadSharedCalendars}
          id={editModalOpen}
        />
      ) : null}

      {inviteModalOpen ? (
        <EmailModal
          handleClose={handleCloseInviteModal}
          handleSend={handleSendEmailInvite}
          initialText={inviteModalText}
        />
      ) : null}
    </>
  );
};

export default SharedCalendarsSettings;
